import express from 'express';
import { getDestinations, getDestination, postDestination, updateDestination, deleteDestination } from '../controllers/destinations.controller.js';

const router = express.Router();

router.get('/', getDestinations);

router.get('/:id', getDestination);

router.post('/admin/add', postDestination);

router.put('/admin/update/:id', updateDestination);

router.delete('/admin/delete/:id', deleteDestination);


export default router;
//module.exports = router;

