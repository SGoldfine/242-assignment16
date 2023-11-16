document.addEventListener('DOMContentLoaded', () => {
  loadThings();
  document.getElementById('add-thing-button').addEventListener('click', toggleAddThingForm);
  document.getElementById('thing-form').addEventListener('submit', handleFormSubmit);
});

async function loadThings() {
  try {
      const response = await fetch('/api/things');
      const things = await response.json();
      displayThings(things);
  } catch (error) {
      console.error('Error loading things:', error);
  }
}

function displayThings(things) {
  const thingList = document.getElementById('thing-list');
  thingList.innerHTML = '';
  things.forEach(thing => {
      const thingElement = document.createElement('section');
      thingElement.classList.add('thing');
      let factsList = thing.funFacts.join(', ');
      thingElement.innerHTML = `
          <h3>${thing.name}</h3>
          <p>${thing.inventor}</p>
          <p>${thing.inventionDate}</p>
          <p>${thing.description}</p>
          <p>${factsList}</p>
      `;
      thingList.appendChild(thingElement);
  });
}

function toggleAddThingForm() {
  const formContainer = document.getElementById('thing-form-container');
  formContainer.classList.toggle('hidden');
}

async function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const funFacts = formData.get('funFacts').split(',').map(fact => fact.trim());

  const newThing = {
      name: formData.get('name'),
      inventor: formData.get('inventor'),
      inventionDate: formData.get('inventionDate'),
      description: formData.get('description'),
      funFacts: funFacts,
  };

  try {
      const response = await fetch('/api/things', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(newThing)
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      displayThings(result);
      toggleAddThingForm();
      event.target.reset();
  } catch (error) {
      console.error('Error submitting form:', error);
  }
}




// const showThings = async () => {
//     let things = await getThings();
//     let thingsDiv = document.getElementById("things-div");
//     thingsDiv.innerHTML = "";
//     things.forEach((thing) => {
//       const section = document.createElement("section");
//       thingsDiv.append(section);
  
//       const h2 = document.createElement("h2");
//       h2.innerHTML = thing.name;
//       section.append(h2);
      
//       const inventor = document.createElement("p");
//       inventor.innerHTML = thing.inventor;
//       section.append(inventor);
  
//       const date = document.createElement("p");
//       date.innerHTML = thing.inventionDate;
//       section.append(date);
  
//       const desc = document.createElement("p");
//       desc.innerHTML = thing.description;
//       section.append(desc);
  
//       let details = document.createElement("div");
//       details.classList.add("things-details");
//       section.append(details);
      
//       const funFacts = document.createElement("ul");
//       thing.funFacts.forEach(facts => {
//         const fact = document.createElement("li");
//         fact.textContent = facts;
//         funFacts.appendChild(fact);
//       });
//       section.append(funFacts);
      
//       const img = document.createElement("img");
//       img.src = thing.img;
//       section.append(img);
//     });
//   }
  
//   const getThings = async () => {
//     try {
//       const response = await fetch("api/things");
//         if(!response.ok) {
//           throw new Error('Error');
//         }
//         return await response.json();
//     } catch(error) {
//         console.log("error retrieving json");
//         return "";
//     }
//   }

//   const showAddThing = () => {
//     document.getElementById("modern").classList.toggle("hidden");
//     document.getElementById("newthing").classList.toggle("hidden");
//   }

//   const printThing = () => {  
//     const newthing = document.getElementById("new");

//     const name = document.getElementById("txt-name").value;
  
//     const inventor = document.getElementById("txt-inventor").value;
  
//     const date = document.getElementById("txt-date").value;
      
//     const description = document.getElementById("txt-description").value;

//     const facts = document.getElementById("txt-facts").value;
  
//     newthing.innerHTML += `<section class = "section"><h2>${name}</h2> <p>${inventor}</p> <p>${date}</p> <p>${description}</p> <ul><li>${facts}</li></section>`;
  
//     document.getElementById("new").classList.toggle("hidden");
//   }

//   const addThing = async(e) => {
//     e.preventDefault();
//     const form = document.getElementById("add-thing-form");
//     const formData = new FormData(form);
//     let response;
//     //trying to add a new recipe
//     if (form._id.value == -1) {
//         formData.delete("_id");
//         formData.delete("name");
//         formData.append("facts", getAllThings());

//         console.log(...formData);

//         response = await fetch("/api/things", {
//             method: "POST",
//             body: formData
//         });
//     }

//     //successfully got data from server
//     if (response.status != 200) {
//         console.log("Error posting data");
//     }

//     response = await response.json();
//     resetForm();
//     document.querySelector(".dialog").classList.add("transparent");
//     showRecipes();
// };

// const getAllThings = () => {
//   const inputs = document.querySelectorAll("#fact-boxes input");
//   let facts = [];

//   inputs.forEach((input) => {
//       facts.push(input.value);
//   });

//   return facts;
// }

// const resetForm = () => {
//   const form = document.getElementById("add-thing-form");
//   form.reset();
//   form._id = "-1";
//   document.getElementById("thing-boxes").innerHTML = "";
// };

// const addFact = (e) => {
//   e.preventDefault();
//   const section = document.getElementById("fact-boxes");
//   const input = document.createElement("input");
//   input.type = "text";
//   section.append(input);
// }

  
// window.onload = () => {
//   document.getElementById("add-thing").onclick = showAddThing;
//   document.getElementById("button-add").onclick = printThing;
//   document.getElementById("add-thing").onclick = addThing;
//   showThings();
// }