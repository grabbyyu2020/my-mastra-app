import { mastra } from './src/mastra/index.js';

// 获取通用代码生成agent
const universalAgent = mastra.getAgent('universalCodeAgent');

async function quickDemo() {
  console.log('🚀 Universal Code Agent - Quick Demo\n');

  // 示例1: 生成一个简单的Python脚本
  console.log('📝 Generating Python script...');
  try {
    const result1 = await universalAgent.generate(`
    创建一个Python脚本，功能是：
    - 读取CSV文件
    - 计算数据统计信息（平均值、最大值、最小值）
    - 生成简单的图表
    - 保存结果到文件
    
    文件名：data_analyzer.py
    `, {
      memory: {
        resource: 'demo-user',
        thread: 'python-demo'
      }
    });
    
    console.log('✅ Python script generated and saved to out/');
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // 示例2: 生成一个Go程序
  console.log('\n📝 Generating Go program...');
  try {
    const result2 = await universalAgent.generate(`
    创建一个Go程序，实现HTTP服务器：
    - 提供REST API端点
    - 处理JSON请求和响应
    - 包含基本的中间件
    - 添加日志记录
    
    文件名：server.go
    `, {
      memory: {
        resource: 'demo-user',
        thread: 'go-demo'
      }
    });
    
    console.log('✅ Go program generated and saved to out/');
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // 示例3: 生成一个JavaScript组件
  console.log('\n📝 Generating JavaScript component...');  
  try {
    const result3 = await universalAgent.generate(`
    创建一个React组件：
    - 用户登录表单
    - 表单验证
    - 状态管理
    - 响应式设计
    
    使用TypeScript，文件名：LoginForm.tsx
    `, {
      memory: {
        resource: 'demo-user',
        thread: 'react-demo'
      }
    });
    
    console.log('✅ React component generated and saved to out/');
  } catch (error) {
    console.error('❌ Error:', error);
  }

  // 检查生成的文件
  console.log('\n📁 Checking generated files...');
  try {
    const fileList = await universalAgent.generate(`
    列出out目录中的所有文件，并简要说明每个文件的用途
    `, {
      memory: {
        resource: 'demo-user',
        thread: 'file-check'
      }
    });
    
    console.log('\n📊 Generated Files Summary:');
    console.log(fileList.text);
  } catch (error) {
    console.error('❌ Error:', error);
  }

  console.log('\n🎉 Quick Demo Completed!');
  console.log('✅ Check the out/ directory for generated code files');
  console.log('💡 Try using the agent with your own programming requests!');
}

// 运行演示
quickDemo().catch(console.error); 