import os
import sys

def create_component(name, description):
    """
    Simulates an AI Agent generating a React component based on PRD description.
    """
    path = f"growai-map-solutions/components/{name}.tsx"
    
    # Simple Template for the AI Agent to fill
    content = f"""
import React from 'react';

/**
 * AI Generated Component: {name}
 * Description: {description}
 */
const {name} = () => {{
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{name}</h2>
      <div className="text-gray-600">
        <p className="mb-4">{description}</p>
        <div className="p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          Placeholder for AI-driven interactive features from PRD.
        </div>
      </div>
    </div>
  );
}};

export default {name};
"""
    # Note: Adjusting path to match the actual src structure
    # Current working dir is backend, we need to go up to src
    full_path = os.path.join(os.getcwd(), "..", path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Agent: Created component {name} at {path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python agent_dev.py <ComponentName> <Description>")
    else:
        create_component(sys.argv[1], sys.argv[2])
