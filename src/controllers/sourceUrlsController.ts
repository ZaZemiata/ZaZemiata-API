/**
 * SourceUrls Controller
 * 
 * @module sourceUrlsController.ts
 * @author Geno Popov <geno_popov@yahoo.com>
 */

import express from 'express';
import { updateSourceUrlActiveStatus } from '../services/sourceUrlsService';

const router = express.Router();

router.post('/api/source-urls/:id/active', updateSourceUrlActiveStatus);

export default router;