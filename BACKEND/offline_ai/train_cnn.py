import os
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, models, transforms
from torch.utils.data import DataLoader
import json
from PIL import Image
import numpy as np

# ==========================================
# CONFIGURATION
# ==========================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "dataset")
MODEL_SAVE_PATH = os.path.join(BASE_DIR, "plant_disease_model.pth")
CLASS_MAPPING_PATH = os.path.join(BASE_DIR, "class_mapping.json")
BATCH_SIZE = 32
EPOCHS = 1
LEARNING_RATE = 0.001

def create_dummy_dataset():
    """Creates a dummy dataset so the training script doesn't crash if the user hasn't provided real data."""
    print("Creating dummy dataset for initial training...")
    dummy_classes = ["tomato_healthy", "tomato_early_blight", "wheat_rust", "non_crop"]
    os.makedirs(DATA_DIR, exist_ok=True)
    
    for cls in dummy_classes:
        cls_dir = os.path.join(DATA_DIR, cls)
        os.makedirs(cls_dir, exist_ok=True)
        # Create 5 random images per class
        for i in range(5):
            img_path = os.path.join(cls_dir, f"dummy_{i}.jpg")
            if not os.path.exists(img_path):
                # Random color image
                img_array = np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8)
                img = Image.fromarray(img_array)
                img.save(img_path)
    print("Dummy dataset created.")

def train_model():
    print(f"Checking for dataset in: {DATA_DIR}...")
    if not os.path.exists(DATA_DIR) or len(os.listdir(DATA_DIR)) == 0:
        print(f"Warning: Directory '{DATA_DIR}' not found or empty.")
        print("Please replace this dummy dataset with real folders of images (e.g., 'tomato_healthy', 'non_crop') for real accuracy.")
        create_dummy_dataset()

    # Data Augmentation & Normalization for Training
    data_transforms = {
        'train': transforms.Compose([
            transforms.RandomResizedCrop(224),
            transforms.RandomHorizontalFlip(),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
        'val': transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ]),
    }

    full_dataset = datasets.ImageFolder(DATA_DIR, data_transforms['train'])
    
    # Save class mapping
    class_names = full_dataset.classes
    with open(CLASS_MAPPING_PATH, 'w') as f:
        json.dump(class_names, f)
    print(f"Found {len(class_names)} classes: {class_names}")

    dataloader = DataLoader(full_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=0)
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    # Build Model
    print("Loading MobileNetV2 architecture...")
    model = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.DEFAULT)
    num_ftrs = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(num_ftrs, len(class_names))
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.classifier.parameters(), lr=LEARNING_RATE)

    print("Starting training...")
    for epoch in range(EPOCHS):
        model.train()
        running_loss = 0.0
        running_corrects = 0

        for inputs, labels in dataloader:
            inputs = inputs.to(device)
            labels = labels.to(device)

            optimizer.zero_grad()

            with torch.set_grad_enabled(True):
                outputs = model(inputs)
                _, preds = torch.max(outputs, 1)
                loss = criterion(outputs, labels)

                loss.backward()
                optimizer.step()

            running_loss += loss.item() * inputs.size(0)
            running_corrects += torch.sum(preds == labels.data)

        epoch_loss = running_loss / len(full_dataset)
        epoch_acc = running_corrects.double() / len(full_dataset)

        print(f"Epoch {epoch+1}/{EPOCHS} - Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f}")

    # Save the Model Weights
    torch.save(model.state_dict(), MODEL_SAVE_PATH)
    print(f"Training complete! Model saved to {MODEL_SAVE_PATH}")
    print(f"Class mapping saved to {CLASS_MAPPING_PATH}")

if __name__ == "__main__":
    train_model()
