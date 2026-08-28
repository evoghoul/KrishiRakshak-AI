import os
from PIL import Image

data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "dataset")
classes = ["non_crop", "tomato_healthy", "tomato_early_blight", "wheat_rust", "rice_bacterial_blight"]

if not os.path.exists(data_dir):
    os.makedirs(data_dir)

# Create 5 small images per class
for cls in classes:
    cls_dir = os.path.join(data_dir, cls)
    if not os.path.exists(cls_dir):
        os.makedirs(cls_dir)
        
    for i in range(5):
        img = Image.new('RGB', (100, 100), color = (73, 109, 137) if 'healthy' in cls else (137, 73, 73))
        img.save(os.path.join(cls_dir, f"img_{i}.jpg"))

print("Dummy dataset created.")
