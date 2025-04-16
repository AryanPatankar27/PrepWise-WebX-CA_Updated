const userRoutes = require('./routes/userRoutes');
const mcqRoutes = require('./routes/mcqRoutes');

// Routes
app.use('/api', userRoutes);
app.use('/api', mcqRoutes); 