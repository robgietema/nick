/**
 * Server.
 * @module server
 */

import app from './app';

const port = 8000;

app.listen(port, () => console.log(`Server listening on port ${port}`));
