"""
AI Vision Service for Material Reception
Analyzes images to extract product information
"""

import base64
import json
import re
from datetime import datetime, date
from typing import Dict, Optional, Any
import logging

logger = logging.getLogger(__name__)

class AIVisionService:
    def __init__(self):
        self.food_categories = [
            "meat", "poultry", "seafood", "dairy", "vegetables", "fruits",
            "grains", "bakery", "frozen", "canned", "beverages", "spices",
            "oils", "condiments", "snacks", "desserts"
        ]
    
    def analyze_reception_image(self, image_data: str) -> Dict[str, Any]:
        """
        Analyze reception box image and extract product information
        This is a mock implementation - in production, integrate with OpenAI Vision API or similar
        """
        try:
            # Mock AI analysis - replace with actual AI service
            analysis = self._mock_ai_analysis(image_data)
            
            # Process and validate results
            processed_analysis = self._process_analysis_results(analysis)
            
            return {
                "success": True,
                "analysis": processed_analysis,
                "confidence": analysis.get("confidence", 0.8),
                "timestamp": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"AI vision analysis failed: {e}")
            return {
                "success": False,
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
    
    def _mock_ai_analysis(self, image_data: str) -> Dict[str, Any]:
        """
        Mock AI analysis - replace with actual AI service call
        In production, this would call OpenAI Vision API, Google Vision, or similar
        """
        # Simulate AI recognition based on common patterns
        mock_results = [
            {
                "product_name": "Fresh Chicken Breast",
                "category": "poultry",
                "barcode": "1234567890123",
                "quantity": "2.5",
                "unit": "kg",
                "expiry_date": "2024-02-15",
                "batch_number": "CB240201",
                "confidence": 0.92
            },
            {
                "product_name": "Organic Salmon Fillet",
                "category": "seafood",
                "barcode": "9876543210987",
                "quantity": "1.8",
                "unit": "kg",
                "expiry_date": "2024-02-10",
                "batch_number": "SF240205",
                "confidence": 0.88
            },
            {
                "product_name": "Mixed Vegetables",
                "category": "vegetables",
                "barcode": "5555666677778",
                "quantity": "5",
                "unit": "kg",
                "expiry_date": "2024-02-20",
                "batch_number": "MV240208",
                "confidence": 0.85
            }
        ]
        
        # Return a random mock result for demonstration
        import random
        return random.choice(mock_results)
    
    def _process_analysis_results(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Process and validate AI analysis results"""
        processed = {}
        
        # Extract product name
        if "product_name" in analysis:
            processed["product_name"] = self._clean_text(analysis["product_name"])
        
        # Validate and normalize category
        if "category" in analysis:
            category = analysis["category"].lower()
            if category in self.food_categories:
                processed["category"] = category
            else:
                processed["category"] = self._guess_category(processed.get("product_name", ""))
        
        # Validate barcode
        if "barcode" in analysis:
            barcode = self._clean_barcode(analysis["barcode"])
            if self._is_valid_barcode(barcode):
                processed["barcode"] = barcode
        
        # Parse quantity and unit
        if "quantity" in analysis and "unit" in analysis:
            try:
                processed["quantity"] = float(analysis["quantity"])
                processed["unit"] = self._normalize_unit(analysis["unit"])
            except ValueError:
                pass
        
        # Parse expiry date
        if "expiry_date" in analysis:
            expiry = self._parse_date(analysis["expiry_date"])
            if expiry:
                processed["expiry_date"] = expiry.isoformat()
        
        # Clean batch number
        if "batch_number" in analysis:
            processed["batch_number"] = self._clean_text(analysis["batch_number"])
        
        return processed
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        if not text:
            return ""
        return re.sub(r'\s+', ' ', text.strip())
    
    def _clean_barcode(self, barcode: str) -> str:
        """Clean barcode - remove non-numeric characters"""
        if not barcode:
            return ""
        return re.sub(r'[^0-9]', '', barcode)
    
    def _is_valid_barcode(self, barcode: str) -> bool:
        """Validate barcode format"""
        if not barcode:
            return False
        # Check common barcode lengths (UPC, EAN, etc.)
        return len(barcode) in [8, 12, 13, 14]
    
    def _normalize_unit(self, unit: str) -> str:
        """Normalize unit of measurement"""
        if not unit:
            return "pieces"
        
        unit = unit.lower().strip()
        unit_mapping = {
            "kg": "kg", "kilogram": "kg", "kilograms": "kg",
            "g": "g", "gram": "g", "grams": "g",
            "lb": "lb", "pound": "lb", "pounds": "lb",
            "oz": "oz", "ounce": "oz", "ounces": "oz",
            "l": "l", "liter": "l", "liters": "l",
            "ml": "ml", "milliliter": "ml", "milliliters": "ml",
            "pcs": "pieces", "piece": "pieces", "pieces": "pieces",
            "box": "boxes", "boxes": "boxes",
            "pack": "packs", "packs": "packs"
        }
        
        return unit_mapping.get(unit, unit)
    
    def _parse_date(self, date_str: str) -> Optional[date]:
        """Parse date from various formats"""
        if not date_str:
            return None
        
        # Common date formats
        formats = [
            "%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%d-%m-%Y",
            "%Y%m%d", "%d.%m.%Y", "%m.%d.%Y"
        ]
        
        for fmt in formats:
            try:
                return datetime.strptime(date_str, fmt).date()
            except ValueError:
                continue
        
        return None
    
    def _guess_category(self, product_name: str) -> str:
        """Guess food category from product name"""
        if not product_name:
            return "other"
        
        name_lower = product_name.lower()
        
        # Category keywords
        category_keywords = {
            "meat": ["beef", "pork", "lamb", "veal", "steak", "ground"],
            "poultry": ["chicken", "turkey", "duck", "goose", "poultry"],
            "seafood": ["fish", "salmon", "tuna", "shrimp", "crab", "lobster", "seafood"],
            "dairy": ["milk", "cheese", "butter", "yogurt", "cream", "dairy"],
            "vegetables": ["carrot", "potato", "onion", "tomato", "lettuce", "vegetable"],
            "fruits": ["apple", "banana", "orange", "berry", "fruit"],
            "bakery": ["bread", "roll", "bun", "pastry", "cake", "bakery"],
            "frozen": ["frozen", "ice"],
            "beverages": ["juice", "soda", "water", "drink", "beverage"]
        }
        
        for category, keywords in category_keywords.items():
            if any(keyword in name_lower for keyword in keywords):
                return category
        
        return "other"

# Global instance
ai_vision_service = AIVisionService()