function initializeProjectList() {
    getAllProjects(access_token).then(labs => {
        console.log("getAllProjects()");
        console.log(labs);
        let listProjects = [];
        for (let i = 0; i < labs.length; i++) {
            let currentLab = labs[i];
            if (currentLab.lab.name == null) {
                currentLab.lab.name = "Personal";
            }
            for (let j = 0; j < currentLab.projects.length; j++) {
                const project = currentLab.projects[j];
                console.log(`${currentLab.lab.name} -> ${project.title}`);
                const newProject = {
                    "id": project.id,
                    "title": project.title,
                    "lab_id": currentLab.lab.id,
                    "lab_title": currentLab.lab.name
                };
                listProjects.push(newProject);
            }
        }
        // Using d3 to create the list of projects
        let options = d3.select("#projects-list")
            .on("change", () => {
                // Print the selected project id
                let selected_project = d3.select("#projects-list").property('value');
                localStorage.setItem("selected_project", selected_project);
                updateMapList(selected_project);
                console.log(selected_project);
            })
            .selectAll("option")
            .data(listProjects, d => d.id);
        options.enter()
            .append("option")
            .attr("value", (d) => { return d.id })
            .text((d) => { return `${d.lab_title} -> ${d.title}` });
        options.append("option")
            .attr("value", (d) => { return d.id })
            .text((d) => { return `${d.lab_title} -> ${d.title}` });
        options.exit().remove();
        localStorage.setItem("selected_project", listProjects[0].id);
        updateMapList(listProjects[0].id);
    });
}

function updateMapList(selected_project) {
    users = [];
    getProjectById(access_token, selected_project).then(project => {
        project.users.forEach(element => {
            users.push({ id: element.id, name: element.name });
        });
        console.log(project.missions);
        let options = d3.select("#missions-list")
            .on("change", () => {
                // Print the selected mission id
                let selected_mission = d3.select("#missions-list").property('value');
                localStorage.setItem("selected_mission", selected_mission);
                updateKitList(selected_mission);
                console.log(selected_mission);
            })
            .selectAll("option")
            .data(project.missions, d => d.id);
        options.enter()
            .append("option")
            .attr("value", (d) => { return d.id })
            .text((d) => { return d.title });
        options.append("option")
            .attr("value", (d) => { return d.id })
            .text((d) => { return d.title });
        options.exit().remove();
        localStorage.setItem("selected_mission", project.missions[0].id);
        updateKitList(project.missions[0].id);
    });
}

function updateKitList(selected_mission) {
    getAllContentsByMissionId(access_token, selected_mission).then(mission => {
        /* 
           Remember that the kit Id is the generic kit! 
           The content Id is the instance of that kit in the mission
           In this function, we are only interested in the instance of the kit
         */
        console.log("printing mission");
        console.log(mission);
        let options = d3.select("#kits-list")
            .on("change", () => {
                // Print the selected kit id
                let selected_kit = d3.select("#kits-list").property("value");
                setSelectedKit(selected_kit);
                console.log("printing mission");
                console.log(mission);

            })
            .selectAll("option")
            .data(mission.content, d => d.id);
        options.enter()
            .append("option")
            .attr("value", (d) => { return d.id })
            .text((d) => { return d.kit.title });
        options.append("option")
            .attr("value", (d) => { return d.id })
            .text((d) => { return d.kit.title });
        options.exit().remove();
        let initialSelectedKit = mission.content[0].id;
        setSelectedKit(initialSelectedKit);
    });
}

function setSelectedKit(kit_id) {
    localStorage.setItem("selected_kit", kit_id);
    updateQuestionList(kit_id);
}

function updateQuestionList(selected_content) {
    getContentById(access_token, selected_content).then(content => {
        console.log("printing content");
        console.log(content);
        let options = d3.select("#questions-list")
            .on("change", () => {
                // Print the selected question id
                let selected_question = d3.select("#questions-list").property("value");
                console.log(selected_question);
                updateComments(selected_content, selected_question);
            })
            .selectAll("option")
            .data(content.kit.questions, d => d.id);
        options.enter()
            .append("option")
            .attr("value", (d) => { return d.id })
            .text((d) => { return d.question });
        options.append("option")
            .attr("value", (d) => { return d.id })
            .text((d) => { return d.question });
        options.exit().remove();
        updateComments(selected_content, content.kit.questions[0].id);
    });
}

function updateComments(selected_content, selected_question){
    getParentComments(access_token, selected_content, selected_question).then(comments => {
        console.log("printing comments");
        console.log(comments);
        let options = d3.select("#comments-list")
            .on("change", () => {
                // Print the selected question id
                let selected_comment = d3.select("#comments-list").property("value");
                console.log(selected_comment);
            })
            .selectAll("p")
            .data(comments.content, d => d.id);
        options.enter()
            .append("p")
            //.attr("value", (d) => { return d.id })
            .text((d) => { return d.text });
        options.append("p")
            //.attr("value", (d) => { return d.id })
            .text((d) => { return d.text });
        options.exit().remove();
    });
}