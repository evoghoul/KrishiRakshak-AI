import os
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import json
import io

# ==========================================
# CONFIGURATION
# ==========================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_SAVE_PATH = os.path.join(BASE_DIR, "plant_disease_model.pth")
CLASS_MAPPING_PATH = os.path.join(BASE_DIR, "class_mapping.json")

# Global variables for caching the model
_model = None
_class_names = None
_device = None

def load_model():
    """Loads the model and class mapping into memory if not already loaded."""
    global _model, _class_names, _device
    
    if _model is not None:
        return
        
    print("Loading offline CNN Vision Model...")
    _device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    
    if not os.path.exists(CLASS_MAPPING_PATH):
        raise FileNotFoundError(f"Class mapping not found at {CLASS_MAPPING_PATH}. Please run train_cnn.py first.")
        
    if not os.path.exists(MODEL_SAVE_PATH):
        raise FileNotFoundError(f"Model weights not found at {MODEL_SAVE_PATH}. Please run train_cnn.py first.")

    with open(CLASS_MAPPING_PATH, 'r') as f:
        _class_names = json.load(f)

    # Initialize MobileNetV2 architecture to match training
    _model = models.mobilenet_v2(pretrained=False)
    num_ftrs = _model.classifier[1].in_features
    _model.classifier[1] = nn.Linear(num_ftrs, len(_class_names))
    
    # Load trained weights
    _model.load_state_dict(torch.load(MODEL_SAVE_PATH, map_location=_device))
    _model = _model.to(_device)
    _model.eval()
    print("Offline CNN Vision Model loaded successfully.")

def predict_image(image_bytes: bytes):
    """
    Takes image bytes, preprocesses it, and returns the predicted class label.
    """
    load_model()
    
    # Preprocess image
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    except Exception as e:
        return {"status": "error", "message": f"Invalid image format: {e}"}

    preprocess = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ])
    
    input_tensor = preprocess(image)
    input_batch = input_tensor.unsqueeze(0).to(_device)

    # Inference
    with torch.no_grad():
        output = _model(input_batch)
        probabilities = torch.nn.functional.softmax(output[0], dim=0)
        confidence, predicted_idx = torch.max(probabilities, 0)
        
    predicted_class = _class_names[predicted_idx.item()]
    
    if predicted_class == "non_crop":
        crop_name = "Unknown"
        disease = "Not a Crop"
    else:
        # e.g., 'tomato_early_blight' -> Crop: Tomato, Disease: Early Blight
        # or 'tomato_healthy' -> Crop: Tomato, Disease: Healthy
        parts = predicted_class.split('_', 1)
        crop_name = parts[0].capitalize()
        disease = parts[1].replace('_', ' ').title() if len(parts) > 1 else "Unknown Disease"

    return {
        "status": "success",
        "raw_class": predicted_class,
        "crop": crop_name,
        "condition": disease,
        "confidence": round(confidence.item(), 4),
        "is_plant": predicted_class != "non_crop"
    }
