import torch
from PIL import Image
from transformers import CLIPProcessor, CLIPModel

class SceneEncoder:
    def __init__(self, model_name="openai/clip-vit-base-patch32"):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = CLIPModel.from_pretrained(model_name).to(self.device)
        self.processor = CLIPProcessor.from_pretrained(model_name)

    def encode_image(self, image_path):
        image = Image.open(image_path).convert("RGB")
        inputs = self.processor(images=image, return_tensors="pt").to(self.device)
        with torch.no_grad():
            image_features = self.model.get_image_features(**inputs)
        
        # Normalize features
        image_features /= image_features.norm(p=2, dim=-1, keepdim=True)
        return image_features.cpu().numpy().tolist()[0]

    def encode_text(self, text):
        inputs = self.processor(text=[text], return_tensors="pt", padding=True).to(self.device)
        with torch.no_grad():
            text_features = self.model.get_text_features(**inputs)
        
        # Normalize features
        text_features /= text_features.norm(p=2, dim=-1, keepdim=True)
        return text_features.cpu().numpy().tolist()[0]
