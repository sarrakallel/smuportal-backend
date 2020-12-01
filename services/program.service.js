const Program = require("../models/program")
function programService() {

    async function addProgram(name,information,country,university,deadline,gpa,programtype) {
        return Program.create({Name: name,Information: information,Country: country,University: university,Deadline: deadline,GPA: gpa,ProgramType: programtype})
      }

      async function getPrograms() {
        return Program.find({})
      }
    
      async function deleteProgram(name) {
        return Program.delete({Name: name})
      }
    
      return {
        addProgram,
        deleteProgram,
        getPrograms,
}}
module.exports = programService;


