import os
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, models, transforms
from torch.utils.data import DataLoader
import json

# ==========================================
# CONFIGURATION
# ==========================================
DATA_DIR = "dataset" # Create this folder and put your images here
MODEL_SAVE_PATH = "plant_disease_model.pth"
CLASS_MAPPING_PATH = "class_mapping.json"
BATCH_SIZE = 32
EPOCHS = 1
LEARNING_RATE = 0.001

# The expected dataset structure:
# dataset/
# ├── non_crop/             (Invalid images)
# ├── tomato_healthy/       (Healthy Tomato)
# ├── tomato_early_blight/  (Diseased Tomato)
# └── wheat_rust/           (Diseased Wheat)
# etc...

def train_model():
    print(f"Checking for dataset in: {DATA_DIR}...")
    if not os.path.exists(DATA_DIR):
        print(f"Error: Directory '{DATA_DIR}' not found.")
        print("Please create the 'dataset' folder and organize your images into subfolders based on their class (e.g., 'tomato_healthy', 'non_crop').")
        return

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

    # Load Dataset (Assuming 80-20 Train-Val Split can be done manually or via SubsetRandomSampler, using full folder here for simplicity)
    full_dataset = datasets.ImageFolder(os.path.join(DATA_DIR), data_transforms['train'])
    
    # Save class mapping
    class_names = full_dataset.classes
    with open(CLASS_MAPPING_PATH, 'w') as f:
        json.dump(class_names, f)
    print(f"Found {len(class_names)} classes: {class_names}")

    dataloader = DataLoader(full_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=4)
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    # Build Model (MobileNetV2 is fast and efficient for CPU/Edge)
    print("Loading MobileNetV2 architecture...")
    model = models.mobilenet_v2(pretrained=True)
    num_ftrs = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(num_ftrs, len(class_names))
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.classifier.parameters(), lr=LEARNING_RATE)

    # Training Loop
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
