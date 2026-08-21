import Stripe from "stripe";
import envConfig from "./envConfig";


export const stripe = new Stripe(envConfig.SRIPE_SECRET_KEY)