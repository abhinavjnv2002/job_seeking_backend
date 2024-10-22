import express from 'express';
import { deleteJob, getAllJobs, getSingleJob, getmyJobs, postJob, updateJob } from '../controllers/jobController.js';
import {isAuthorised} from '../middlewares/auth.js'

const router=express.Router();

router.get("/getall",getAllJobs);
router.post("/post",isAuthorised,postJob);
router.get("/getmyJobs",isAuthorised,getmyJobs);
router.put("/update/:id",isAuthorised,updateJob);
router.delete("/delete/:id",isAuthorised,deleteJob);
router.get("/get/:id",isAuthorised,getSingleJob);

export default router;