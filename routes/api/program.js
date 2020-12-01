const Router = require("express").Router;
const programService = require("../../services/program.service")();
const Program = require("../../models/program");
const router = Router({
    mergeParams: true,
  });
   
  //get program
  router.get("/getPrograms", async(req, res) => {
    try {
      const programs = await programService.getPrograms();
      res.send(programs);
    } catch(err) {
      res.json({ success: false, msg: "Failed to get programs"});
    }
  });

//add a program
  router.post("/addProgram", async(req, res, next) => {
    try {
        const {name,information,country,university,deadline,gpa,programtype} = req.body;
        await programService.addProgram(name,information,country,university,deadline,gpa,programtype);
        res.send({ success: true, msg: "Program Added"});
    } catch (err) {
        res.send({ success: false, msg: " Program not able to be added!", err})
    }
});

 //Delete a program 
router.delete("/deleteProgram", async(req, res) => {
    try {
      const name = req.params.name;
      programService.deleteProgram(name);
      res.send({ success: true, msg: "Program deleted"})
    } catch (error) {
      res.send({ success: false, msg: "Program not added!"})
    }
  })
  module.exports = router;

  