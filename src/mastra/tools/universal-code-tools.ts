import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname, extname, basename } from 'path';

// 通用文件保存工具
export const saveFileTool = createTool({
  id: 'save-file',
  description: 'Save generated code to a file in the out directory. Supports any file type and programming language.',
  inputSchema: z.object({
    filename: z.string().describe('Name of the file to save (with extension, e.g., "main.py", "app.js", "README.md")'),
    content: z.string().describe('Content to write to the file'),
    directory: z.string().default('out').describe('Directory to save the file in (relative to project root)'),
    overwrite: z.boolean().default(true).describe('Whether to overwrite existing files'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    filePath: z.string(),
    message: z.string(),
    fileSize: z.number(),
  }),
  execute: async ({ context }) => {
    const { filename, content, directory, overwrite } = context;
    
    try {
      // 确保目录存在
      if (!existsSync(directory)) {
        mkdirSync(directory, { recursive: true });
      }
      
      const filePath = join(directory, filename);
      
      // 检查文件是否已存在
      if (existsSync(filePath) && !overwrite) {
        return {
          success: false,
          filePath,
          message: `File ${filename} already exists and overwrite is disabled`,
          fileSize: 0,
        };
      }
      
      // 确保文件所在的子目录存在
      const fileDir = dirname(filePath);
      if (!existsSync(fileDir)) {
        mkdirSync(fileDir, { recursive: true });
      }
      
      // 写入文件
      writeFileSync(filePath, content, 'utf8');
      
      // 获取文件大小
      const stats = statSync(filePath);
      const fileSize = stats.size;
      
      return {
        success: true,
        filePath,
        message: `Successfully saved ${filename} (${fileSize} bytes)`,
        fileSize,
      };
      
    } catch (error) {
      return {
        success: false,
        filePath: '',
        message: `Failed to save file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        fileSize: 0,
      };
    }
  },
});

// 列出目录中的文件
export const listFilesTool = createTool({
  id: 'list-files',
  description: 'List files in a directory to see what has been generated.',
  inputSchema: z.object({
    directory: z.string().default('out').describe('Directory to list files from'),
    recursive: z.boolean().default(false).describe('Whether to list files recursively'),
    fileTypes: z.array(z.string()).default([]).describe('Filter by file extensions (e.g., [".py", ".js"])'),
  }),
  outputSchema: z.object({
    files: z.array(z.object({
      name: z.string(),
      path: z.string(),
      size: z.number(),
      extension: z.string(),
      isDirectory: z.boolean(),
    })),
    totalFiles: z.number(),
    message: z.string(),
  }),
  execute: async ({ context }) => {
    const { directory, recursive, fileTypes } = context;
    
    try {
      if (!existsSync(directory)) {
        return {
          files: [],
          totalFiles: 0,
          message: `Directory ${directory} does not exist`,
        };
      }
      
      const files: Array<{
        name: string;
        path: string;
        size: number;
        extension: string;
        isDirectory: boolean;
      }> = [];
      
      function scanDirectory(dirPath: string) {
        const items = readdirSync(dirPath);
        
        for (const item of items) {
          const itemPath = join(dirPath, item);
          const stats = statSync(itemPath);
          const extension = extname(item);
          
          // 如果指定了文件类型过滤器，检查是否匹配
          if (fileTypes.length > 0 && !stats.isDirectory() && !fileTypes.includes(extension)) {
            continue;
          }
          
          files.push({
            name: item,
            path: itemPath,
            size: stats.size,
            extension,
            isDirectory: stats.isDirectory(),
          });
          
          // 递归扫描子目录
          if (recursive && stats.isDirectory()) {
            scanDirectory(itemPath);
          }
        }
      }
      
      scanDirectory(directory);
      
      return {
        files,
        totalFiles: files.length,
        message: `Found ${files.length} items in ${directory}`,
      };
      
    } catch (error) {
      return {
        files: [],
        totalFiles: 0,
        message: `Failed to list files: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },
});

// 通用代码生成工具
export const generateCodeTool = createTool({
  id: 'generate-code',
  description: 'Generate code in any programming language based on requirements. This is a flexible tool that can create any type of code file.',
  inputSchema: z.object({
    requirements: z.string().describe('Detailed requirements for the code to generate'),
    language: z.string().describe('Programming language (e.g., Python, JavaScript, TypeScript, Go, Rust, Java, C++, etc.)'),
    fileType: z.string().describe('Type of file/component to generate (e.g., API, class, function, config, test, etc.)'),
    framework: z.string().optional().describe('Framework or library to use (e.g., React, Express, Django, FastAPI, etc.)'),
    style: z.string().default('modern').describe('Code style preference (modern, traditional, minimal, verbose)'),
    includeComments: z.boolean().default(true).describe('Whether to include explanatory comments'),
    includeTests: z.boolean().default(false).describe('Whether to include test cases'),
    includeDocstrings: z.boolean().default(true).describe('Whether to include documentation strings'),
  }),
  outputSchema: z.object({
    code: z.string(),
    filename: z.string(),
    language: z.string(),
    explanation: z.string(),
    dependencies: z.array(z.string()),
    suggestions: z.array(z.string()),
    additionalFiles: z.array(z.object({
      filename: z.string(),
      content: z.string(),
      description: z.string(),
    })),
  }),
  execute: async ({ context }) => {
    const { 
      requirements, 
      language, 
      fileType, 
      framework, 
      style, 
      includeComments, 
      includeTests, 
      includeDocstrings 
    } = context;
    
    // 根据编程语言确定文件扩展名
    const getFileExtension = (lang: string): string => {
      const extensions: Record<string, string> = {
        'python': '.py',
        'javascript': '.js',
        'typescript': '.ts',
        'java': '.java',
        'go': '.go',
        'rust': '.rs',
        'cpp': '.cpp',
        'c++': '.cpp',
        'c': '.c',
        'csharp': '.cs',
        'c#': '.cs',
        'php': '.php',
        'ruby': '.rb',
        'swift': '.swift',
        'kotlin': '.kt',
        'dart': '.dart',
        'scala': '.scala',
        'r': '.r',
        'matlab': '.m',
        'shell': '.sh',
        'bash': '.sh',
        'powershell': '.ps1',
        'sql': '.sql',
        'html': '.html',
        'css': '.css',
        'scss': '.scss',
        'less': '.less',
        'yaml': '.yml',
        'json': '.json',
        'xml': '.xml',
        'markdown': '.md',
        'dockerfile': '.dockerfile',
      };
      
      return extensions[lang.toLowerCase()] || '.txt';
    };
    
    // 生成基础文件名
    const generateFilename = (type: string, lang: string): string => {
      const typeNames: Record<string, string> = {
        'api': 'api',
        'server': 'server',
        'client': 'client',
        'model': 'model',
        'controller': 'controller',
        'service': 'service',
        'class': 'main',
        'function': 'utils',
        'config': 'config',
        'test': 'test',
        'component': 'component',
        'module': 'module',
        'script': 'script',
        'main': 'main',
        'app': 'app',
      };
      
      const baseName = typeNames[type.toLowerCase()] || 'generated';
      return baseName + getFileExtension(lang);
    };
    
    const filename = generateFilename(fileType, language);
    const dependencies: string[] = [];
    const suggestions: string[] = [];
    const additionalFiles: Array<{filename: string, content: string, description: string}> = [];
    
    // 根据语言和需求生成代码
    let code = '';
    let explanation = '';
    
    // Python代码生成
    if (language.toLowerCase() === 'python') {
      if (framework?.toLowerCase() === 'fastapi') {
        dependencies.push('fastapi', 'uvicorn', 'pydantic');
        code = `${includeDocstrings ? '"""FastAPI application generated based on requirements."""\n\n' : ''}from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(title="Generated API", version="1.0.0")

${includeComments ? '# Pydantic models for request/response' : ''}
class ItemModel(BaseModel):
    id: Optional[int] = None
    name: str
    description: Optional[str] = None

${includeComments ? '# In-memory storage (replace with database in production)' : ''}
items = []

@app.get("/")
async def root():
    ${includeDocstrings ? '"""Root endpoint."""' : ''}
    return {"message": "Generated FastAPI application"}

@app.get("/items", response_model=List[ItemModel])
async def get_items():
    ${includeDocstrings ? '"""Get all items."""' : ''}
    return items

@app.post("/items", response_model=ItemModel)
async def create_item(item: ItemModel):
    ${includeDocstrings ? '"""Create a new item."""' : ''}
    item.id = len(items) + 1
    items.append(item)
    return item

@app.get("/items/{item_id}", response_model=ItemModel)
async def get_item(item_id: int):
    ${includeDocstrings ? '"""Get item by ID."""' : ''}
    for item in items:
        if item.id == item_id:
            return item
    raise HTTPException(status_code=404, detail="Item not found")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
`;
        
        if (includeTests) {
          additionalFiles.push({
            filename: 'test_main.py',
            content: `import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Generated FastAPI application"}

def test_create_and_get_item():
    # Create item
    item_data = {"name": "Test Item", "description": "Test Description"}
    response = client.post("/items", json=item_data)
    assert response.status_code == 200
    created_item = response.json()
    assert created_item["name"] == "Test Item"
    
    # Get item
    item_id = created_item["id"]
    response = client.get(f"/items/{item_id}")
    assert response.status_code == 200
    assert response.json() == created_item
`,
            description: 'Unit tests for the FastAPI application'
          });
        }
        
        explanation = `Generated a FastAPI application with REST endpoints for item management. Includes Pydantic models for data validation and basic CRUD operations.`;
        suggestions.push('Add database integration (SQLAlchemy or MongoDB)');
        suggestions.push('Implement authentication and authorization');
        suggestions.push('Add input validation and error handling');
        
      } else if (framework?.toLowerCase() === 'django') {
        dependencies.push('django', 'djangorestframework');
        code = `${includeDocstrings ? '"""Django models and views."""\n\n' : ''}from django.db import models
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

${includeComments ? '# Django model' : ''}
class Item(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def to_dict(self):
        ${includeDocstrings ? '"""Convert model instance to dictionary."""' : ''}
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }

${includeComments ? '# API Views' : ''}
@csrf_exempt
@require_http_methods(["GET", "POST"])
def items_view(request):
    ${includeDocstrings ? '"""Handle GET and POST requests for items."""' : ''}
    if request.method == 'GET':
        items = Item.objects.all()
        return JsonResponse([item.to_dict() for item in items], safe=False)
    
    elif request.method == 'POST':
        data = json.loads(request.body)
        item = Item.objects.create(
            name=data.get('name'),
            description=data.get('description', '')
        )
        return JsonResponse(item.to_dict(), status=201)

@csrf_exempt
@require_http_methods(["GET", "PUT", "DELETE"])
def item_detail_view(request, item_id):
    ${includeDocstrings ? '"""Handle GET, PUT, DELETE requests for specific item."""' : ''}
    try:
        item = Item.objects.get(id=item_id)
    except Item.DoesNotExist:
        return JsonResponse({'error': 'Item not found'}, status=404)
    
    if request.method == 'GET':
        return JsonResponse(item.to_dict())
    
    elif request.method == 'PUT':
        data = json.loads(request.body)
        item.name = data.get('name', item.name)
        item.description = data.get('description', item.description)
        item.save()
        return JsonResponse(item.to_dict())
    
    elif request.method == 'DELETE':
        item.delete()
        return JsonResponse({'message': 'Item deleted'}, status=204)
`;
        
        additionalFiles.push({
          filename: 'urls.py',
          content: `from django.urls import path
from . import views

urlpatterns = [
    path('items/', views.items_view, name='items'),
    path('items/<int:item_id>/', views.item_detail_view, name='item-detail'),
]
`,
          description: 'URL configuration for the Django application'
        });
        
        explanation = `Generated Django models and API views with CRUD operations. Includes proper HTTP method handling and JSON responses.`;
        
      } else {
        // 普通Python代码
        code = `${includeDocstrings ? '"""Generated Python module based on requirements."""\n\n' : ''}${includeComments ? '# Imports' : ''}
from typing import List, Dict, Optional, Any
import json
import logging
from dataclasses import dataclass
from datetime import datetime

${includeComments ? '# Configure logging' : ''}
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class DataModel:
    ${includeDocstrings ? '"""Data model for the application."""' : ''}
    id: int
    name: str
    description: Optional[str] = None
    created_at: datetime = None
    
    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now()
    
    def to_dict(self) -> Dict[str, Any]:
        ${includeDocstrings ? '"""Convert to dictionary representation."""' : ''}
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class DataManager:
    ${includeDocstrings ? '"""Manager class for data operations."""' : ''}
    
    def __init__(self):
        self.data: List[DataModel] = []
        self.next_id = 1
    
    def create(self, name: str, description: Optional[str] = None) -> DataModel:
        ${includeDocstrings ? '"""Create a new data item."""' : ''}
        item = DataModel(id=self.next_id, name=name, description=description)
        self.data.append(item)
        self.next_id += 1
        logger.info(f"Created item: {item.name}")
        return item
    
    def get_all(self) -> List[DataModel]:
        ${includeDocstrings ? '"""Get all data items."""' : ''}
        return self.data.copy()
    
    def get_by_id(self, item_id: int) -> Optional[DataModel]:
        ${includeDocstrings ? '"""Get item by ID."""' : ''}
        for item in self.data:
            if item.id == item_id:
                return item
        return None
    
    def update(self, item_id: int, name: Optional[str] = None, 
               description: Optional[str] = None) -> Optional[DataModel]:
        ${includeDocstrings ? '"""Update an existing item."""' : ''}
        item = self.get_by_id(item_id)
        if item:
            if name is not None:
                item.name = name
            if description is not None:
                item.description = description
            logger.info(f"Updated item {item_id}")
            return item
        return None
    
    def delete(self, item_id: int) -> bool:
        ${includeDocstrings ? '"""Delete an item by ID."""' : ''}
        for i, item in enumerate(self.data):
            if item.id == item_id:
                del self.data[i]
                logger.info(f"Deleted item {item_id}")
                return True
        return False
    
    def save_to_file(self, filename: str) -> None:
        ${includeDocstrings ? '"""Save data to JSON file."""' : ''}
        data = [item.to_dict() for item in self.data]
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)
        logger.info(f"Data saved to {filename}")

def main():
    ${includeDocstrings ? '"""Main function to demonstrate usage."""' : ''}
    manager = DataManager()
    
    ${includeComments ? '# Create some sample data' : ''}
    item1 = manager.create("Sample Item 1", "This is a sample description")
    item2 = manager.create("Sample Item 2", "Another sample")
    
    ${includeComments ? '# List all items' : ''}
    print("All items:")
    for item in manager.get_all():
        print(f"  {item.id}: {item.name}")
    
    ${includeComments ? '# Update an item' : ''}
    manager.update(1, name="Updated Item 1")
    
    ${includeComments ? '# Save to file' : ''}
    manager.save_to_file("data.json")

if __name__ == "__main__":
    main()
`;
        
        explanation = `Generated a Python module with data management functionality using modern Python features like dataclasses and type hints.`;
      }
      
      suggestions.push('Add error handling and logging');
      suggestions.push('Consider using environment variables for configuration');
      suggestions.push('Add input validation');
      
    }
    
    // JavaScript/Node.js代码生成
    else if (language.toLowerCase() === 'javascript' || language.toLowerCase() === 'nodejs') {
      if (framework?.toLowerCase() === 'express') {
        dependencies.push('express', 'cors', 'helmet', 'morgan');
        code = `${includeComments ? '// Express.js application generated based on requirements' : ''}
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

${includeComments ? '// Middleware setup' : ''}
app.use(helmet()); ${includeComments ? '// Security headers' : ''}
app.use(cors()); ${includeComments ? '// Enable CORS' : ''}
app.use(morgan('combined')); ${includeComments ? '// Logging' : ''}
app.use(express.json()); ${includeComments ? '// Parse JSON bodies' : ''}
app.use(express.urlencoded({ extended: true })); ${includeComments ? '// Parse URL-encoded bodies' : ''}

${includeComments ? '// In-memory storage (replace with database in production)' : ''}
let items = [];
let nextId = 1;

${includeComments ? '// Routes' : ''}
app.get('/', (req, res) => {
  res.json({ message: 'Generated Express.js API', version: '1.0.0' });
});

app.get('/items', (req, res) => {
  res.json(items);
});

app.post('/items', (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  const item = {
    id: nextId++,
    name,
    description: description || '',
    createdAt: new Date().toISOString()
  };
  
  items.push(item);
  res.status(201).json(item);
});

app.get('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(item => item.id === id);
  
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  res.json(item);
});

app.put('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = items.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  const { name, description } = req.body;
  
  if (name) items[itemIndex].name = name;
  if (description !== undefined) items[itemIndex].description = description;
  items[itemIndex].updatedAt = new Date().toISOString();
  
  res.json(items[itemIndex]);
});

app.delete('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = items.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  items.splice(itemIndex, 1);
  res.status(204).send();
});

${includeComments ? '// Error handling middleware' : ''}
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

${includeComments ? '// 404 handler' : ''}
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

${includeComments ? '// Start server' : ''}
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});

module.exports = app;
`;
        
        if (includeTests) {
          dependencies.push('jest', 'supertest');
          additionalFiles.push({
            filename: 'app.test.js',
            content: `const request = require('supertest');
const app = require('./app');

describe('Express App', () => {
  test('GET / should return welcome message', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);
    
    expect(response.body.message).toBe('Generated Express.js API');
  });

  test('POST /items should create new item', async () => {
    const newItem = { name: 'Test Item', description: 'Test Description' };
    
    const response = await request(app)
      .post('/items')
      .send(newItem)
      .expect(201);
    
    expect(response.body.name).toBe(newItem.name);
    expect(response.body.id).toBeDefined();
  });

  test('GET /items should return all items', async () => {
    const response = await request(app)
      .get('/items')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
  });
});
`,
            description: 'Unit tests for the Express.js application'
          });
          
          additionalFiles.push({
            filename: 'package.json',
            content: `{
  "name": "generated-express-app",
  "version": "1.0.0",
  "description": "Generated Express.js application",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.0",
    "cors": "^2.8.5",
    "helmet": "^6.0.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "nodemon": "^2.0.0",
    "supertest": "^6.3.0"
  }
}
`,
            description: 'Package.json with dependencies and scripts'
          });
        }
        
        explanation = `Generated an Express.js REST API with CRUD operations, security middleware, and proper error handling.`;
        suggestions.push('Add database integration (MongoDB, PostgreSQL)');
        suggestions.push('Implement authentication and authorization');
        suggestions.push('Add input validation with a library like Joi');
        
      } else {
        // 普通JavaScript代码
        code = `${includeComments ? '// Generated JavaScript module' : ''}
${includeComments ? '// Modern JavaScript with ES6+ features' : ''}

class DataManager {
  constructor() {
    this.data = [];
    this.nextId = 1;
  }

  ${includeComments ? '/**\n   * Create a new item\n   * @param {string} name - Item name\n   * @param {string} description - Item description\n   * @returns {Object} Created item\n   */' : ''}
  create(name, description = '') {
    if (!name) {
      throw new Error('Name is required');
    }

    const item = {
      id: this.nextId++,
      name,
      description,
      createdAt: new Date().toISOString()
    };

    this.data.push(item);
    console.log(\`Created item: \${name}\`);
    return item;
  }

  ${includeComments ? '/**\n   * Get all items\n   * @returns {Array} All items\n   */' : ''}
  getAll() {
    return [...this.data];
  }

  ${includeComments ? '/**\n   * Get item by ID\n   * @param {number} id - Item ID\n   * @returns {Object|null} Found item or null\n   */' : ''}
  getById(id) {
    return this.data.find(item => item.id === id) || null;
  }

  ${includeComments ? '/**\n   * Update an item\n   * @param {number} id - Item ID\n   * @param {Object} updates - Updates to apply\n   * @returns {Object|null} Updated item or null\n   */' : ''}
  update(id, updates) {
    const itemIndex = this.data.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return null;
    }

    this.data[itemIndex] = {
      ...this.data[itemIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    console.log(\`Updated item \${id}\`);
    return this.data[itemIndex];
  }

  ${includeComments ? '/**\n   * Delete an item\n   * @param {number} id - Item ID\n   * @returns {boolean} True if deleted, false if not found\n   */' : ''}
  delete(id) {
    const itemIndex = this.data.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return false;
    }

    this.data.splice(itemIndex, 1);
    console.log(\`Deleted item \${id}\`);
    return true;
  }

  ${includeComments ? '/**\n   * Filter items by criteria\n   * @param {Function} predicate - Filter function\n   * @returns {Array} Filtered items\n   */' : ''}
  filter(predicate) {
    return this.data.filter(predicate);
  }

  ${includeComments ? '/**\n   * Search items by name\n   * @param {string} query - Search query\n   * @returns {Array} Matching items\n   */' : ''}
  search(query) {
    const lowerQuery = query.toLowerCase();
    return this.data.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery)
    );
  }

  ${includeComments ? '/**\n   * Save data to localStorage (browser) or file (Node.js)\n   * @param {string} key - Storage key\n   */' : ''}
  save(key = 'dataManager') {
    if (typeof localStorage !== 'undefined') {
      ${includeComments ? '// Browser environment' : ''}
      localStorage.setItem(key, JSON.stringify(this.data));
      console.log(\`Data saved to localStorage with key: \${key}\`);
    } else if (typeof require !== 'undefined') {
      ${includeComments ? '// Node.js environment' : ''}
      const fs = require('fs');
      fs.writeFileSync(\`\${key}.json\`, JSON.stringify(this.data, null, 2));
      console.log(\`Data saved to \${key}.json\`);
    }
  }

  ${includeComments ? '/**\n   * Load data from localStorage (browser) or file (Node.js)\n   * @param {string} key - Storage key\n   */' : ''}
  load(key = 'dataManager') {
    try {
      if (typeof localStorage !== 'undefined') {
        ${includeComments ? '// Browser environment' : ''}
        const data = localStorage.getItem(key);
        if (data) {
          this.data = JSON.parse(data);
          this.nextId = Math.max(...this.data.map(item => item.id), 0) + 1;
          console.log(\`Data loaded from localStorage with key: \${key}\`);
        }
      } else if (typeof require !== 'undefined') {
        ${includeComments ? '// Node.js environment' : ''}
        const fs = require('fs');
        if (fs.existsSync(\`\${key}.json\`)) {
          const data = fs.readFileSync(\`\${key}.json\`, 'utf8');
          this.data = JSON.parse(data);
          this.nextId = Math.max(...this.data.map(item => item.id), 0) + 1;
          console.log(\`Data loaded from \${key}.json\`);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }
}

${includeComments ? '// Usage example' : ''}
function main() {
  const manager = new DataManager();
  
  ${includeComments ? '// Create some sample data' : ''}
  manager.create('Sample Item 1', 'This is a sample description');
  manager.create('Sample Item 2', 'Another sample item');
  
  ${includeComments ? '// List all items' : ''}
  console.log('All items:', manager.getAll());
  
  ${includeComments ? '// Search for items' : ''}
  console.log('Search results:', manager.search('sample'));
  
  ${includeComments ? '// Save data' : ''}
  manager.save('myData');
}

${includeComments ? '// Export for use as module' : ''}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataManager;
} else if (typeof window !== 'undefined') {
  window.DataManager = DataManager;
}

${includeComments ? '// Run main if this file is executed directly' : ''}
if (typeof require !== 'undefined' && require.main === module) {
  main();
}
`;
        
        explanation = `Generated a flexible JavaScript data management class with CRUD operations, search functionality, and persistence support for both browser and Node.js environments.`;
      }
      
      suggestions.push('Add TypeScript support for better type safety');
      suggestions.push('Consider using a bundler like Webpack or Rollup');
      suggestions.push('Add ESLint and Prettier for code quality');
      
    }
    
    // TypeScript代码生成
    else if (language.toLowerCase() === 'typescript') {
      code = `${includeComments ? '// Generated TypeScript module with strong typing' : ''}
${includeComments ? '// Modern TypeScript with advanced type features' : ''}

interface DataItem {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

interface CreateItemData {
  name: string;
  description?: string;
}

interface UpdateItemData {
  name?: string;
  description?: string;
}

type FilterPredicate<T> = (item: T) => boolean;
type SortComparator<T> = (a: T, b: T) => number;

class DataManager<T extends DataItem = DataItem> {
  private data: T[] = [];
  private nextId: number = 1;

  ${includeDocstrings ? '/**\n   * Create a new data item\n   * @param itemData - Data for the new item\n   * @returns The created item\n   */' : ''}
  create(itemData: CreateItemData): T {
    if (!itemData.name?.trim()) {
      throw new Error('Name is required and cannot be empty');
    }

    const item = {
      id: this.nextId++,
      name: itemData.name.trim(),
      description: itemData.description?.trim() || '',
      createdAt: new Date().toISOString()
    } as T;

    this.data.push(item);
    console.log(\`Created item: \${item.name}\`);
    return item;
  }

  ${includeDocstrings ? '/**\n   * Get all items\n   * @returns Array of all items\n   */' : ''}
  getAll(): T[] {
    return [...this.data];
  }

  ${includeDocstrings ? '/**\n   * Get item by ID\n   * @param id - Item ID\n   * @returns Found item or undefined\n   */' : ''}
  getById(id: number): T | undefined {
    return this.data.find(item => item.id === id);
  }

  ${includeDocstrings ? '/**\n   * Update an existing item\n   * @param id - Item ID\n   * @param updates - Updates to apply\n   * @returns Updated item or undefined if not found\n   */' : ''}
  update(id: number, updates: UpdateItemData): T | undefined {
    const itemIndex = this.data.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return undefined;
    }

    const updatedItem = {
      ...this.data[itemIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    } as T;

    this.data[itemIndex] = updatedItem;
    console.log(\`Updated item \${id}\`);
    return updatedItem;
  }

  ${includeDocstrings ? '/**\n   * Delete an item by ID\n   * @param id - Item ID\n   * @returns True if deleted, false if not found\n   */' : ''}
  delete(id: number): boolean {
    const itemIndex = this.data.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return false;
    }

    this.data.splice(itemIndex, 1);
    console.log(\`Deleted item \${id}\`);
    return true;
  }

  ${includeDocstrings ? '/**\n   * Filter items using a predicate function\n   * @param predicate - Filter function\n   * @returns Filtered items\n   */' : ''}
  filter(predicate: FilterPredicate<T>): T[] {
    return this.data.filter(predicate);
  }

  ${includeDocstrings ? '/**\n   * Sort items using a comparator function\n   * @param comparator - Sort function\n   * @returns Sorted items (new array)\n   */' : ''}
  sort(comparator: SortComparator<T>): T[] {
    return [...this.data].sort(comparator);
  }

  ${includeDocstrings ? '/**\n   * Search items by name or description\n   * @param query - Search query\n   * @returns Matching items\n   */' : ''}
  search(query: string): T[] {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) return [];

    return this.data.filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      (item.description && item.description.toLowerCase().includes(lowerQuery))
    );
  }

  ${includeDocstrings ? '/**\n   * Get items count\n   * @returns Number of items\n   */' : ''}
  count(): number {
    return this.data.length;
  }

  ${includeDocstrings ? '/**\n   * Check if any items exist\n   * @returns True if items exist\n   */' : ''}
  isEmpty(): boolean {
    return this.data.length === 0;
  }

  ${includeDocstrings ? '/**\n   * Clear all data\n   */' : ''}
  clear(): void {
    this.data = [];
    this.nextId = 1;
    console.log('All data cleared');
  }

  ${includeDocstrings ? '/**\n   * Export data as JSON string\n   * @returns JSON string representation\n   */' : ''}
  toJSON(): string {
    return JSON.stringify(this.data, null, 2);
  }

  ${includeDocstrings ? '/**\n   * Import data from JSON string\n   * @param jsonData - JSON string to import\n   */' : ''}
  fromJSON(jsonData: string): void {
    try {
      const imported = JSON.parse(jsonData) as T[];
      if (!Array.isArray(imported)) {
        throw new Error('Invalid JSON data: expected array');
      }

      this.data = imported;
      this.nextId = Math.max(...this.data.map(item => item.id), 0) + 1;
      console.log(\`Imported \${this.data.length} items\`);
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }
}

${includeComments ? '// Utility functions' : ''}
export const sortComparators = {
  byName: <T extends DataItem>(a: T, b: T): number => a.name.localeCompare(b.name),
  byCreatedAt: <T extends DataItem>(a: T, b: T): number => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  byId: <T extends DataItem>(a: T, b: T): number => a.id - b.id,
};

export const filterPredicates = {
  withDescription: <T extends DataItem>(item: T): boolean => !!item.description,
  withoutDescription: <T extends DataItem>(item: T): boolean => !item.description,
  createdAfter: <T extends DataItem>(date: Date) => (item: T): boolean => 
    new Date(item.createdAt) > date,
  createdBefore: <T extends DataItem>(date: Date) => (item: T): boolean => 
    new Date(item.createdAt) < date,
};

${includeComments ? '// Usage example' : ''}
function main(): void {
  const manager = new DataManager();
  
  ${includeComments ? '// Create sample data' : ''}
  const item1 = manager.create({ name: 'TypeScript Project', description: 'A sample TypeScript project' });
  const item2 = manager.create({ name: 'JavaScript Migration', description: 'Convert JS to TS' });
  
  ${includeComments ? '// Demonstrate search and filtering' : ''}
  console.log('Search results:', manager.search('typescript'));
  console.log('Items with description:', manager.filter(filterPredicates.withDescription));
  console.log('Sorted by name:', manager.sort(sortComparators.byName));
  
  ${includeComments ? '// Data export/import' : ''}
  const jsonData = manager.toJSON();
  console.log('Exported data:', jsonData);
}

${includeComments ? '// Export the class and types' : ''}
export { DataManager, DataItem, CreateItemData, UpdateItemData, FilterPredicate, SortComparator };
export default DataManager;

${includeComments ? '// Run main if this is the entry point' : ''}
if (require.main === module) {
  main();
}
`;
      
      if (includeTests) {
        dependencies.push('jest', '@types/jest', 'ts-jest');
        additionalFiles.push({
          filename: 'DataManager.test.ts',
          content: `import DataManager, { DataItem, sortComparators, filterPredicates } from './DataManager';

describe('DataManager', () => {
  let manager: DataManager;

  beforeEach(() => {
    manager = new DataManager();
  });

  describe('create', () => {
    it('should create a new item', () => {
      const item = manager.create({ name: 'Test Item', description: 'Test description' });
      
      expect(item).toBeDefined();
      expect(item.id).toBe(1);
      expect(item.name).toBe('Test Item');
      expect(item.description).toBe('Test description');
      expect(item.createdAt).toBeDefined();
    });

    it('should throw error for empty name', () => {
      expect(() => {
        manager.create({ name: '' });
      }).toThrow('Name is required and cannot be empty');
    });
  });

  describe('getById', () => {
    it('should return item by id', () => {
      const created = manager.create({ name: 'Test Item' });
      const found = manager.getById(created.id);
      
      expect(found).toEqual(created);
    });

    it('should return undefined for non-existent id', () => {
      const found = manager.getById(999);
      expect(found).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update existing item', () => {
      const created = manager.create({ name: 'Original' });
      const updated = manager.update(created.id, { name: 'Updated' });
      
      expect(updated).toBeDefined();
      expect(updated!.name).toBe('Updated');
      expect(updated!.updatedAt).toBeDefined();
    });
  });

  describe('search', () => {
    beforeEach(() => {
      manager.create({ name: 'TypeScript Project', description: 'TS project' });
      manager.create({ name: 'JavaScript App', description: 'JS application' });
    });

    it('should find items by name', () => {
      const results = manager.search('typescript');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('TypeScript Project');
    });

    it('should find items by description', () => {
      const results = manager.search('application');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('JavaScript App');
    });
  });
});
`,
          description: 'Comprehensive unit tests for the TypeScript DataManager class'
        });
        
        additionalFiles.push({
          filename: 'tsconfig.json',
          content: `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
`,
          description: 'TypeScript configuration file'
        });
      }
      
      explanation = `Generated a robust TypeScript module with strong typing, generics, and comprehensive data management functionality.`;
      dependencies.push('typescript', '@types/node');
      suggestions.push('Add runtime type validation with libraries like Zod or Yup');
      suggestions.push('Consider using decorators for validation and metadata');
      suggestions.push('Add JSDoc comments for better IDE support');
      
    }
    
    // Go代码生成
    else if (language.toLowerCase() === 'go') {
      code = `${includeComments ? '// Generated Go application' : ''}
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
)

${includeComments ? '// Data structures' : ''}
type Item struct {
	ID          int       \`json:"id"\`
	Name        string    \`json:"name"\`
	Description string    \`json:"description"\`
	CreatedAt   time.Time \`json:"created_at"\`
	UpdatedAt   time.Time \`json:"updated_at,omitempty"\`
}

type CreateItemRequest struct {
	Name        string \`json:"name"\`
	Description string \`json:"description"\`
}

type UpdateItemRequest struct {
	Name        string \`json:"name,omitempty"\`
	Description string \`json:"description,omitempty"\`
}

${includeComments ? '// In-memory storage (replace with database in production)' : ''}
type ItemStore struct {
	items  []Item
	nextID int
}

func NewItemStore() *ItemStore {
	return &ItemStore{
		items:  make([]Item, 0),
		nextID: 1,
	}
}

func (s *ItemStore) Create(req CreateItemRequest) Item {
	item := Item{
		ID:          s.nextID,
		Name:        req.Name,
		Description: req.Description,
		CreatedAt:   time.Now(),
	}
	s.items = append(s.items, item)
	s.nextID++
	return item
}

func (s *ItemStore) GetAll() []Item {
	return s.items
}

func (s *ItemStore) GetByID(id int) (Item, bool) {
	for _, item := range s.items {
		if item.ID == id {
			return item, true
		}
	}
	return Item{}, false
}

func (s *ItemStore) Update(id int, req UpdateItemRequest) (Item, bool) {
	for i, item := range s.items {
		if item.ID == id {
			if req.Name != "" {
				s.items[i].Name = req.Name
			}
			if req.Description != "" {
				s.items[i].Description = req.Description
			}
			s.items[i].UpdatedAt = time.Now()
			return s.items[i], true
		}
	}
	return Item{}, false
}

func (s *ItemStore) Delete(id int) bool {
	for i, item := range s.items {
		if item.ID == id {
			s.items = append(s.items[:i], s.items[i+1:]...)
			return true
		}
	}
	return false
}

${includeComments ? '// API handlers' : ''}
type APIServer struct {
	store *ItemStore
}

func NewAPIServer() *APIServer {
	return &APIServer{
		store: NewItemStore(),
	}
}

func (api *APIServer) handleGetItems(w http.ResponseWriter, r *http.Request) {
	items := api.store.GetAll()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(items)
}

func (api *APIServer) handleCreateItem(w http.ResponseWriter, r *http.Request) {
	var req CreateItemRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	if req.Name == "" {
		http.Error(w, "Name is required", http.StatusBadRequest)
		return
	}

	item := api.store.Create(req)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(item)
}

func (api *APIServer) handleGetItem(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	item, found := api.store.GetByID(id)
	if !found {
		http.Error(w, "Item not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(item)
}

func (api *APIServer) handleUpdateItem(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var req UpdateItemRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	item, found := api.store.Update(id, req)
	if !found {
		http.Error(w, "Item not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(item)
}

func (api *APIServer) handleDeleteItem(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	if !api.store.Delete(id) {
		http.Error(w, "Item not found", http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

${includeComments ? '// CORS middleware' : ''}
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

${includeComments ? '// Logging middleware' : ''}
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
	})
}

func (api *APIServer) setupRoutes() *mux.Router {
	r := mux.NewRouter()

	${includeComments ? '// Apply middleware' : ''}
	r.Use(corsMiddleware)
	r.Use(loggingMiddleware)

	${includeComments ? '// API routes' : ''}
	r.HandleFunc("/api/items", api.handleGetItems).Methods("GET")
	r.HandleFunc("/api/items", api.handleCreateItem).Methods("POST")
	r.HandleFunc("/api/items/{id}", api.handleGetItem).Methods("GET")
	r.HandleFunc("/api/items/{id}", api.handleUpdateItem).Methods("PUT")
	r.HandleFunc("/api/items/{id}", api.handleDeleteItem).Methods("DELETE")

	${includeComments ? '// Health check' : ''}
	r.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	}).Methods("GET")

	return r
}

func main() {
	api := NewAPIServer()
	router := api.setupRoutes()

	port := ":8080"
	log.Printf("Server starting on port %s", port)
	
	if err := http.ListenAndServe(port, router); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}
`;
      
      dependencies.push('github.com/gorilla/mux');
      
      if (includeTests) {
        additionalFiles.push({
          filename: 'main_test.go',
          content: `package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestItemStore(t *testing.T) {
	store := NewItemStore()

	// Test Create
	req := CreateItemRequest{Name: "Test Item", Description: "Test Description"}
	item := store.Create(req)

	if item.ID != 1 {
		t.Errorf("Expected ID 1, got %d", item.ID)
	}
	if item.Name != "Test Item" {
		t.Errorf("Expected name 'Test Item', got %s", item.Name)
	}

	// Test GetByID
	found, exists := store.GetByID(1)
	if !exists {
		t.Error("Expected item to exist")
	}
	if found.Name != "Test Item" {
		t.Errorf("Expected name 'Test Item', got %s", found.Name)
	}

	// Test Update
	updateReq := UpdateItemRequest{Name: "Updated Item"}
	updated, exists := store.Update(1, updateReq)
	if !exists {
		t.Error("Expected item to exist for update")
	}
	if updated.Name != "Updated Item" {
		t.Errorf("Expected name 'Updated Item', got %s", updated.Name)
	}

	// Test Delete
	deleted := store.Delete(1)
	if !deleted {
		t.Error("Expected item to be deleted")
	}

	_, exists = store.GetByID(1)
	if exists {
		t.Error("Expected item to not exist after deletion")
	}
}

func TestAPIHandlers(t *testing.T) {
	api := NewAPIServer()
	router := api.setupRoutes()

	// Test GET /api/items
	req, _ := http.NewRequest("GET", "/api/items", nil)
	rr := httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("Expected status code %d, got %d", http.StatusOK, status)
	}

	// Test POST /api/items
	itemData := CreateItemRequest{Name: "Test Item", Description: "Test Description"}
	jsonData, _ := json.Marshal(itemData)
	req, _ = http.NewRequest("POST", "/api/items", bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	rr = httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusCreated {
		t.Errorf("Expected status code %d, got %d", http.StatusCreated, status)
	}

	// Test health endpoint
	req, _ = http.NewRequest("GET", "/health", nil)
	rr = httptest.NewRecorder()
	router.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("Expected status code %d, got %d", http.StatusOK, status)
	}
}
`,
          description: 'Unit tests for the Go application'
        });
        
        additionalFiles.push({
          filename: 'go.mod',
          content: `module generated-go-app

go 1.21

require github.com/gorilla/mux v1.8.1
`,
          description: 'Go module file with dependencies'
        });
      }
      
      explanation = `Generated a complete Go REST API with proper struct definitions, middleware, and HTTP handlers using the Gorilla Mux router.`;
      suggestions.push('Add database integration (PostgreSQL, MongoDB)');
      suggestions.push('Implement authentication middleware');
      suggestions.push('Add request validation and better error handling');
      suggestions.push('Consider using a framework like Gin or Echo for more features');
      
    }
    
    // 其他语言的基本代码生成
    else {
      // 通用代码生成逻辑
      const languageTemplates: Record<string, {extension: string, template: string}> = {
        'rust': {
          extension: '.rs',
          template: `${includeComments ? '// Generated Rust code' : ''}
use std::collections::HashMap;
use std::io;

#[derive(Debug, Clone)]
struct Item {
    id: u32,
    name: String,
    description: Option<String>,
}

struct ItemManager {
    items: HashMap<u32, Item>,
    next_id: u32,
}

impl ItemManager {
    fn new() -> Self {
        ItemManager {
            items: HashMap::new(),
            next_id: 1,
        }
    }

    fn create(&mut self, name: String, description: Option<String>) -> Result<&Item, String> {
        if name.is_empty() {
            return Err("Name cannot be empty".to_string());
        }

        let item = Item {
            id: self.next_id,
            name,
            description,
        };

        self.items.insert(self.next_id, item);
        let created_item = self.items.get(&self.next_id).unwrap();
        self.next_id += 1;

        println!("Created item: {}", created_item.name);
        Ok(created_item)
    }

    fn get_all(&self) -> Vec<&Item> {
        self.items.values().collect()
    }

    fn get_by_id(&self, id: u32) -> Option<&Item> {
        self.items.get(&id)
    }

    fn delete(&mut self, id: u32) -> bool {
        match self.items.remove(&id) {
            Some(_) => {
                println!("Deleted item {}", id);
                true
            }
            None => false,
        }
    }
}

fn main() -> io::Result<()> {
    let mut manager = ItemManager::new();
    
    ${includeComments ? '// Create sample items' : ''}
    manager.create("Rust Project".to_string(), Some("A sample Rust project".to_string())).unwrap();
    manager.create("Memory Safety".to_string(), None).unwrap();
    
    ${includeComments ? '// List all items' : ''}
    println!("All items:");
    for item in manager.get_all() {
        println!("  {}: {} - {:?}", item.id, item.name, item.description);
    }
    
    Ok(())
}
`
        },
        'java': {
          extension: '.java',
          template: `${includeComments ? '// Generated Java code' : ''}
import java.util.*;
import java.time.LocalDateTime;

public class DataManager {
    private List<Item> items;
    private int nextId;
    
    public DataManager() {
        this.items = new ArrayList<>();
        this.nextId = 1;
    }
    
    public static class Item {
        private int id;
        private String name;
        private String description;
        private LocalDateTime createdAt;
        
        public Item(int id, String name, String description) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.createdAt = LocalDateTime.now();
        }
        
        ${includeComments ? '// Getters and setters' : ''}
        public int getId() { return id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        
        @Override
        public String toString() {
            return String.format("Item{id=%d, name='%s', description='%s'}", 
                id, name, description);
        }
    }
    
    public Item create(String name, String description) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be null or empty");
        }
        
        Item item = new Item(nextId++, name.trim(), description);
        items.add(item);
        System.out.println("Created item: " + item.getName());
        return item;
    }
    
    public List<Item> getAll() {
        return new ArrayList<>(items);
    }
    
    public Optional<Item> getById(int id) {
        return items.stream()
            .filter(item -> item.getId() == id)
            .findFirst();
    }
    
    public boolean update(int id, String name, String description) {
        Optional<Item> itemOpt = getById(id);
        if (itemOpt.isPresent()) {
            Item item = itemOpt.get();
            if (name != null) item.setName(name);
            if (description != null) item.setDescription(description);
            System.out.println("Updated item " + id);
            return true;
        }
        return false;
    }
    
    public boolean delete(int id) {
        boolean removed = items.removeIf(item -> item.getId() == id);
        if (removed) {
            System.out.println("Deleted item " + id);
        }
        return removed;
    }
    
    public List<Item> search(String query) {
        String lowerQuery = query.toLowerCase();
        return items.stream()
            .filter(item -> item.getName().toLowerCase().contains(lowerQuery) ||
                          (item.getDescription() != null && 
                           item.getDescription().toLowerCase().contains(lowerQuery)))
            .collect(ArrayList::new, (list, item) -> list.add(item), (list1, list2) -> list1.addAll(list2));
    }
    
    public static void main(String[] args) {
        DataManager manager = new DataManager();
        
        ${includeComments ? '// Create sample data' : ''}
        manager.create("Java Project", "A sample Java application");
        manager.create("Spring Boot App", "RESTful web service");
        
        ${includeComments ? '// List all items' : ''}
        System.out.println("All items:");
        manager.getAll().forEach(System.out::println);
    }
}
`
        }
      };
      
      const template = languageTemplates[language.toLowerCase()];
      if (template) {
        code = template.template;
      } else {
        // 生成通用代码结构
        code = `${includeComments ? `// Generated ${language} code based on requirements` : ''}
${includeComments ? `// This is a basic template for ${language}` : ''}

${includeComments ? '// TODO: Implement your specific requirements here' : ''}
${includeComments ? `// Requirements: ${requirements}` : ''}

${includeComments ? '// Main implementation' : ''}
${language.toLowerCase() === 'sql' ? 
  `-- Database schema and queries
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO items (name, description) VALUES
    ('Sample Item 1', 'This is a sample description'),
    ('Sample Item 2', 'Another sample item');

-- Basic queries
SELECT * FROM items;
SELECT * FROM items WHERE name LIKE '%sample%';
SELECT COUNT(*) FROM items;` :

  language.toLowerCase() === 'html' ? 
  `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated HTML</title>
</head>
<body>
    <header>
        <h1>Generated Content</h1>
    </header>
    <main>
        <section>
            <h2>Requirements</h2>
            <p>${requirements}</p>
        </section>
    </main>
    <footer>
        <p>&copy; 2024 Generated HTML</p>
    </footer>
</body>
</html>` :
  
  `${includeComments ? `/* ${language} implementation */` : ''}
${includeComments ? `/* Based on: ${requirements} */` : ''}

${includeComments ? '/* Add your implementation here */' : ''}
function main() {
    ${includeComments ? `// Implement ${language} logic` : ''}
    print("Generated ${language} code");
}

main();`
}
`;
      }
      
      explanation = `Generated ${language} code template based on the requirements. This provides a starting structure that can be customized further.`;
      suggestions.push(`Add ${language}-specific libraries and frameworks`);
      suggestions.push('Implement error handling and logging');
      suggestions.push('Add comprehensive documentation');
    }
    
    return {
      code,
      filename,
      language,
      explanation,
      dependencies,
      suggestions,
      additionalFiles,
    };
  },
});

// 项目结构生成工具
export const createProjectStructureTool = createTool({
  id: 'create-project-structure',
  description: 'Create a complete project structure with multiple files and directories for any type of software project.',
  inputSchema: z.object({
    projectName: z.string().describe('Name of the project'),
    projectType: z.string().describe('Type of project (web-app, api, cli, library, mobile-app, etc.)'),
    language: z.string().describe('Primary programming language'),
    framework: z.string().optional().describe('Framework or library to use'),
    features: z.array(z.string()).default([]).describe('Features to include (auth, database, testing, docker, etc.)'),
    directory: z.string().default('out').describe('Base directory to create project in'),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    projectPath: z.string(),
    files: z.array(z.object({
      path: z.string(),
      description: z.string(),
    })),
    message: z.string(),
    nextSteps: z.array(z.string()),
  }),
  execute: async ({ context }) => {
    const { projectName, projectType, language, framework, features, directory } = context;
    
    try {
      const projectPath = join(directory, projectName);
      
      // 创建项目目录
      if (!existsSync(projectPath)) {
        mkdirSync(projectPath, { recursive: true });
      }
      
      const files: Array<{path: string, description: string}> = [];
      const nextSteps: string[] = [];
      
      // 根据项目类型和语言创建不同的结构
      if (language.toLowerCase() === 'python') {
        // Python项目结构
        const srcDir = join(projectPath, 'src', projectName.replace(/-/g, '_'));
        const testsDir = join(projectPath, 'tests');
        const docsDir = join(projectPath, 'docs');
        
        mkdirSync(srcDir, { recursive: true });
        mkdirSync(testsDir, { recursive: true });
        mkdirSync(docsDir, { recursive: true });
        
        // 创建Python文件
        writeFileSync(join(srcDir, '__init__.py'), '', 'utf8');
        writeFileSync(join(srcDir, 'main.py'), `"""Main module for ${projectName}."""

def main():
    """Main entry point."""
    print("Hello from ${projectName}!")

if __name__ == "__main__":
    main()
`, 'utf8');
        
        writeFileSync(join(testsDir, '__init__.py'), '', 'utf8');
        writeFileSync(join(testsDir, 'test_main.py'), `"""Tests for main module."""

import pytest
from src.${projectName.replace(/-/g, '_')}.main import main

def test_main():
    """Test main function."""
    # Add your tests here
    pass
`, 'utf8');
        
        // requirements.txt
        const requirements = ['pytest', 'black', 'flake8'];
        if (framework === 'fastapi') requirements.push('fastapi', 'uvicorn');
        if (framework === 'django') requirements.push('django', 'djangorestframework');
        if (features.includes('database')) requirements.push('sqlalchemy', 'alembic');
        
        writeFileSync(join(projectPath, 'requirements.txt'), requirements.join('\n'), 'utf8');
        
        // setup.py
        writeFileSync(join(projectPath, 'setup.py'), `"""Setup script for ${projectName}."""

from setuptools import setup, find_packages

setup(
    name="${projectName}",
    version="0.1.0",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=[
        # Add your dependencies here
    ],
    python_requires=">=3.8",
)
`, 'utf8');
        
        files.push(
          { path: 'src/', description: 'Source code directory' },
          { path: 'tests/', description: 'Test files' },
          { path: 'requirements.txt', description: 'Python dependencies' },
          { path: 'setup.py', description: 'Package setup script' }
        );
        
        nextSteps.push('Install dependencies: pip install -r requirements.txt');
        nextSteps.push('Run tests: pytest');
        
      } else if (language.toLowerCase() === 'javascript' || language.toLowerCase() === 'typescript') {
        // JavaScript/TypeScript项目结构
        const srcDir = join(projectPath, 'src');
        const testsDir = join(projectPath, 'tests');
        
        mkdirSync(srcDir, { recursive: true });
        mkdirSync(testsDir, { recursive: true });
        
        // package.json
        const packageJson = {
          name: projectName,
          version: '1.0.0',
          description: `Generated ${projectType} project`,
          main: language === 'typescript' ? 'dist/index.js' : 'src/index.js',
          scripts: {
            start: language === 'typescript' ? 'node dist/index.js' : 'node src/index.js',
            dev: language === 'typescript' ? 'ts-node src/index.ts' : 'nodemon src/index.js',
            build: language === 'typescript' ? 'tsc' : 'echo "No build step needed"',
            test: 'jest'
          },
          dependencies: {},
          devDependencies: {
            jest: '^29.0.0'
          }
        };
        
        if (language === 'typescript') {
          packageJson.devDependencies['typescript'] = '^5.0.0';
          packageJson.devDependencies['ts-node'] = '^10.0.0';
          packageJson.devDependencies['@types/node'] = '^20.0.0';
        }
        
        if (framework === 'express') {
          packageJson.dependencies['express'] = '^4.18.0';
          packageJson.dependencies['cors'] = '^2.8.5';
          if (language === 'typescript') {
            packageJson.devDependencies['@types/express'] = '^4.17.0';
          }
        }
        
        writeFileSync(join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2), 'utf8');
        
        // 主文件
        const mainFile = language === 'typescript' ? 'index.ts' : 'index.js';
        const mainContent = language === 'typescript' ? 
          `console.log('Hello from ${projectName}!');` :
          `console.log('Hello from ${projectName}!');`;
          
        writeFileSync(join(srcDir, mainFile), mainContent, 'utf8');
        
        // TypeScript配置
        if (language === 'typescript') {
          writeFileSync(join(projectPath, 'tsconfig.json'), JSON.stringify({
            compilerOptions: {
              target: 'ES2020',
              module: 'commonjs',
              lib: ['ES2020'],
              outDir: './dist',
              rootDir: './src',
              strict: true,
              esModuleInterop: true,
              skipLibCheck: true,
              forceConsistentCasingInFileNames: true
            },
            include: ['src/**/*'],
            exclude: ['node_modules', 'dist']
          }, null, 2), 'utf8');
          
          files.push({ path: 'tsconfig.json', description: 'TypeScript configuration' });
        }
        
        files.push(
          { path: 'src/', description: 'Source code directory' },
          { path: 'package.json', description: 'Node.js package configuration' }
        );
        
        nextSteps.push('Install dependencies: npm install');
        nextSteps.push('Start development: npm run dev');
        
      } else if (language.toLowerCase() === 'go') {
        // Go项目结构
        const cmdDir = join(projectPath, 'cmd', projectName);
        const internalDir = join(projectPath, 'internal');
        const pkgDir = join(projectPath, 'pkg');
        
        mkdirSync(cmdDir, { recursive: true });
        mkdirSync(internalDir, { recursive: true });
        mkdirSync(pkgDir, { recursive: true });
        
        // go.mod
        writeFileSync(join(projectPath, 'go.mod'), `module ${projectName}

go 1.21
`, 'utf8');
        
        // main.go
        writeFileSync(join(cmdDir, 'main.go'), `package main

import (
	"fmt"
	"log"
)

func main() {
	fmt.Println("Hello from ${projectName}!")
}
`, 'utf8');
        
        // Makefile
        writeFileSync(join(projectPath, 'Makefile'), `.PHONY: build run test clean

build:
	go build -o bin/${projectName} ./cmd/${projectName}

run:
	go run ./cmd/${projectName}

test:
	go test ./...

clean:
	rm -rf bin/

install:
	go install ./cmd/${projectName}
`, 'utf8');
        
        files.push(
          { path: 'cmd/', description: 'Application entry points' },
          { path: 'internal/', description: 'Private application code' },
          { path: 'pkg/', description: 'Public library code' },
          { path: 'go.mod', description: 'Go module file' },
          { path: 'Makefile', description: 'Build automation' }
        );
        
        nextSteps.push('Initialize module: go mod tidy');
        nextSteps.push('Run application: make run');
        nextSteps.push('Build binary: make build');
        
      }
      
      // 通用文件
      // README.md
      writeFileSync(join(projectPath, 'README.md'), `# ${projectName}

${framework ? `A ${projectType} built with ${language} and ${framework}.` : `A ${projectType} built with ${language}.`}

## Features

${features.length > 0 ? features.map(f => `- ${f}`).join('\n') : '- Basic project structure'}

## Getting Started

### Prerequisites

- ${language} runtime/compiler
${framework ? `- ${framework} framework` : ''}

### Installation

\`\`\`bash
# Clone the repository
git clone <repository-url>
cd ${projectName}

# Install dependencies
${language === 'python' ? 'pip install -r requirements.txt' : 
  language === 'javascript' || language === 'typescript' ? 'npm install' :
  language === 'go' ? 'go mod tidy' : 'See language-specific instructions'}
\`\`\`

### Usage

\`\`\`bash
${language === 'python' ? 'python src/main.py' :
  language === 'javascript' ? 'npm start' :
  language === 'typescript' ? 'npm run dev' :
  language === 'go' ? 'make run' : 'See language-specific instructions'}
\`\`\`

## Development

${nextSteps.map(step => `- ${step}`).join('\n')}

## Project Structure

\`\`\`
${projectName}/
${files.map(f => `├── ${f.path}`).join('\n')}
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
`, 'utf8');
      
      // .gitignore
      const gitIgnoreContent = language === 'python' ? 
`__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg
.env
.venv
env/
venv/
ENV/
env.bak/
venv.bak/` :

language === 'javascript' || language === 'typescript' ?
`node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
dist/
build/
coverage/
.nyc_output/
*.tgz
*.tar.gz` :

language === 'go' ?
`bin/
*.exe
*.exe~
*.dll
*.so
*.dylib
*.test
*.out
go.work` :

`# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Dependency directories
node_modules/

# Environment variables
.env

# Build outputs
dist/
build/
*.exe`;

      writeFileSync(join(projectPath, '.gitignore'), gitIgnoreContent, 'utf8');
      
      // Docker support if requested
      if (features.includes('docker')) {
        const dockerfileContent = language === 'python' ?
`FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/

EXPOSE 8000

CMD ["python", "src/main.py"]` :

language === 'javascript' ?
`FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src/ ./src/

EXPOSE 3000

CMD ["npm", "start"]` :

language === 'go' ?
`FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o main ./cmd/${projectName}

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/

COPY --from=builder /app/main .

CMD ["./main"]` :

`FROM alpine:latest
WORKDIR /app
COPY . .
CMD ["echo", "Docker support for ${language}"]`;

        writeFileSync(join(projectPath, 'Dockerfile'), dockerfileContent, 'utf8');
        
        writeFileSync(join(projectPath, 'docker-compose.yml'), `version: '3.8'

services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
`, 'utf8');

        files.push(
          { path: 'Dockerfile', description: 'Docker container configuration' },
          { path: 'docker-compose.yml', description: 'Docker Compose setup' }
        );
        
        nextSteps.push('Build Docker image: docker build -t ' + projectName + ' .');
        nextSteps.push('Run with Docker Compose: docker-compose up');
      }
      
      files.push(
        { path: 'README.md', description: 'Project documentation' },
        { path: '.gitignore', description: 'Git ignore rules' }
      );
      
      return {
        success: true,
        projectPath,
        files,
        message: `Successfully created ${projectType} project "${projectName}" with ${files.length} files`,
        nextSteps,
      };
      
    } catch (error) {
      return {
        success: false,
        projectPath: '',
        files: [],
        message: `Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`,
        nextSteps: [],
      };
    }
  },
}); 