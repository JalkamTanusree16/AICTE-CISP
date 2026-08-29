import subprocess
import sys
import os
import time

def main():
    print("=" * 70)
    print(" AICTE National Curriculum Intelligence & Standardization Platform (CISP)")
    print(" Official Statutory Portal & Persistent AI Engine Initializer")
    print("=" * 70)

    base_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(base_dir, "backend")
    frontend_dir = os.path.join(base_dir, "frontend")

    print("\n[1/3] Initializing Database and Seeding Demonstration Data...")
    seed_cmd = [sys.executable, "-m", "app.db.seed_data"]
    subprocess.run(seed_cmd, cwd=backend_dir, check=True)

    print("\n[2/3] Starting FastAPI Backend Server on http://127.0.0.1:8000...")
    backend_process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"],
        cwd=backend_dir
    )

    time.sleep(2)

    print("\n[3/3] Starting React Vite Frontend Server on http://127.0.0.1:5173...")
    frontend_process = subprocess.Popen(
        ["npx.cmd" if os.name == "nt" else "npx", "vite", "--port", "5173", "--host"],
        cwd=frontend_dir
    )

    print("\n" + "=" * 70)
    print(" Platform is now LIVE and RUNNING!")
    print(" - Public & Institutional Web Portal: http://127.0.0.1:5173")
    print(" - Backend REST API Documentation:    http://127.0.0.1:8000/docs")
    print("=" * 70)
    print(" Press Ctrl+C to terminate both servers.\n")

    try:
        backend_process.wait()
        frontend_process.wait()
    except KeyboardInterrupt:
        print("\nShutting down CISP platform servers...")
        backend_process.terminate()
        frontend_process.terminate()

if __name__ == "__main__":
    main()
