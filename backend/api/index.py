import sys
import os

# Ensure backend root directory is in sys.path for Vercel execution
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
