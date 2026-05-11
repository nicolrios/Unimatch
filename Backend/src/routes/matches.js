// Ruta para obtener sugerencias basadas en temas comunes
app.get('/api/matches/suggestions/:clerkId', async (req, res) => {
    const { clerkId } = req.params;
    const session = driver.session();
  
    try {
      const query = `
        MATCH (me:Usuario {id: $clerkId})-[:INTERESADO_EN]->(t:Tema)<-[:INTERESADO_EN]-(other:Usuario)
        WHERE me <> other
        RETURN other.name AS name, 
               other.university AS university, 
               other.career AS career, 
               other.imageUrl AS imageUrl,
               collect(t.nombre) AS commonTopics,
               count(t) AS topicCount
        ORDER BY topicCount DESC
        LIMIT 10
      `;
  
      const result = await session.run(query, { clerkId });
      const suggestions = result.records.map(record => ({
        name: record.get('name'),
        university: record.get('university'),
        career: record.get('career'),
        imageUrl: record.get('imageUrl'),
        commonTopics: record.get('commonTopics')
      }));
  
      res.json(suggestions);
    } catch (error) {
      res.status(500).send(error.message);
    } finally {
      await session.close();
    }
  });