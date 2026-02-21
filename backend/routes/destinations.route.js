import express from 'express';
import Destinations from '../models/destinations.model.js';
import { getDestinations, getDestination, postDestination, updateDestination, deleteDestination } from '../controllers/destinations.controller.js';

const router = express.Router();

router.get('/', getDestinations);

router.get('/:id', getDestination);

router.post('/', postDestination);

router.put('/:id', updateDestination);

router.delete('/:id', deleteDestination);


export default router;
//module.exports = router;

