import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = '/Users/wepie/Desktop/文件夹/vibe-coding/项目/xiangjintao-website';
const systemPrompt = fs.readFileSync(path.join(root, 'src/config/systemPrompt.ts'), 'utf8');
const docs = fs.readFileSync(path.join(root, '项目结构说明文档.md'), 'utf8');
const portfolioData = fs.readFileSync(path.join(root, 'src/portfolioData.ts'), 'utf8');

test('persona prompt removes forced gimmicks and defines a direct answer structure', () => {
  assert.ok(!systemPrompt.includes('高频词汇/句式'));
  assert.ok(!systemPrompt.includes('财迷'));
  assert.ok(!systemPrompt.includes('冷幽默'));
  assert.ok(systemPrompt.includes('默认回答结构'));
  assert.ok(systemPrompt.includes('先直接回答，再解释判断'));
});

test('high-frequency answers are stored as facts plus example phrasing', () => {
  const targetQuestions = [
    '你为什么选择这个专业？',
    '在大学里你学到了什么最重要的东西？',
    '描述一段你最有价值的实习或项目经历',
    '你对未来的职业规划是什么？',
    '你会如何介绍自己？',
    '你如何处理与他人的分歧或冲突？',
  ];

  for (const question of targetQuestions) {
    const questionIndex = systemPrompt.indexOf(question);
    assert.notEqual(questionIndex, -1, `missing question: ${question}`);

    const nextQuestionIndex = systemPrompt.indexOf('### **', questionIndex + 1);
    const block = systemPrompt.slice(
      questionIndex,
      nextQuestionIndex === -1 ? systemPrompt.length : nextQuestionIndex
    );

    assert.ok(block.includes('事实要点：'), `missing facts section for ${question}`);
    assert.ok(block.includes('示例回答：'), `missing example answer for ${question}`);
  }
});

test('maintenance doc points to the active prompt file', () => {
  const locationStart = docs.indexOf('### 在哪里修改？');
  const addKnowledgeStart = docs.indexOf('### 如何添加知识？');
  const locationSection = docs.slice(locationStart, addKnowledgeStart);

  assert.ok(locationSection.includes('src/config/systemPrompt.ts'));
  assert.ok(!locationSection.includes('打开`/src/portfolioData.ts`'));
});

test('welcome copy introduces the chat as a digital double instead of a generic assistant', () => {
  assert.ok(!portfolioData.includes('我是向金涛的 AI 助手'));
  assert.ok(portfolioData.includes('我是向金涛的数字分身'));
});
