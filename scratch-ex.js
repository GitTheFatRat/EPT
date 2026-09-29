const fs = require('fs');
let text = fs.readFileSync('BE/src/services/exam.service.js', 'utf8');

const injection = `
      const passageIds = [...new Set(data.flatMap(d => d.passages.map(p => p.id)))];
      let passageQCount = {};
      if (passageIds.length > 0) {
          const { data: qData } = await supabase.from('questions').select('passage_id, content').in('passage_id', passageIds);
          for (const q of (qData || [])) {
              const c = q.content || {};
              const pts = (c.blanks?.length || 0) + (c.items?.length || 0) + (c.labels?.length || 0);
              passageQCount[q.passage_id] = (passageQCount[q.passage_id] || 0) + (pts > 0 ? pts : 1);
          }
      }
      
      const items = data.map(item => {
          let totalQ = 0;
          item.passages.forEach(p => { totalQ += (passageQCount[p.id] || 0); });
          return {
              id: item.id,
              code: item.code,
              title: item.title,
              description: item.description,
              isPublished: item.is_published,
              createdBy: item.created_by,
              createdAt: item.created_at,
              updatedAt: item.updated_at,
              passages: item.passages,
              totalQuestions: totalQ
          };
      });
`;

text = text.replace(
  /const items = data\.map\(item => \(\{[\s\S]*?\}\)\);/,
  injection
);

fs.writeFileSync('BE/src/services/exam.service.js', text);
