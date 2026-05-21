class Summary {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.content = data.content;
    this.contentType = data.contentType; // 'text', 'url', 'file', 'audio', 'video'
    this.originalContent = data.originalContent;
    this.summaries = {
      short: data.summaries?.short || '',
      detailed: data.summaries?.detailed || '',
      bulletPoints: data.summaries?.bulletPoints || [],
      keywords: data.summaries?.keywords || [],
      actionItems: data.summaries?.actionItems || [],
      topicAnalysis: data.summaries?.topicAnalysis || '',
      strengthsWeaknesses: data.summaries?.strengthsWeaknesses || ''
    };
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      content: this.content,
      contentType: this.contentType,
      originalContent: this.originalContent,
      summaries: this.summaries,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export default Summary;
