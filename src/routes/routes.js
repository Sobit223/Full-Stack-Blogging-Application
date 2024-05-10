import { Router } from "express";
import { blogPost, getallPost, getuserblogs, registerUser, userLogin, verifyJWT } from "../Controllers/controllers.js";

const router = new Router()

router.route('/register').post(registerUser)
router.route('/login').post(userLogin)
router.route('/blogpost').post(verifyJWT, blogPost)
router.route('/getpost').post(verifyJWT, getuserblogs)
router.route('/getallpost').post(verifyJWT,getallPost)
export {router}