import os
import subprocess

def run_step(description, command):
    print(f"--- Step: {description} ---")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"Error: {e.stderr}")

def main():
    # 1. Update Backend (FastAPI)
    run_step("Syncing Backend Logic", "python backend/main.py --sync") 
    
    # 2. Update Frontend (React)
    run_step("Generating UI Components", "python backend/agent_dev.py Dashboard 'Main Overview'")
    
    # 3. Build & Test
    run_step("Building Frontend", "cd growai-map-solutions && npm run build")

if __name__ == "__main__":
    main()
