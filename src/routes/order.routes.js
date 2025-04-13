import Router from 'express'
import { VerifyToken } from '../middleware/auth.middleware.js'
import { createOrder, totalOrder,usersOrder } from '../controllers/order.controller.js'

const router = Router()

router.route('CreateOrder/').post(VerifyToken, createOrder)
router.route('TotalOrder/').get(VerifyToken,totalOrder)
router.route("/usersOrder").get(VerifyToken,usersOrder)
export default router