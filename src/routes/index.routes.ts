const { Router } = require('express');
const router = Router();

//Importar todos los routers
import Artist from './Artist/artist.routes';
import User from './User/user.routes';
import People from './People/people.routes';
import Events from './Events/events.routes';
import Roles from './Roles/roles.routes';
import Categories from './Categories/categories.routes';
import Payment from './Payment/payments.routes';
import Email from './Email/email.routes';

router.use('/', Artist);
router.use('/', User);
router.use('/', People);
router.use('/', Events);
router.use('/', Roles);
router.use('/', Categories);
router.use('/', Payment);
router.use('/', Email);

export default router;