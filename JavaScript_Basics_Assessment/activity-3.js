const studentList = ['Jeff', 'Stacy', 'George'];

for(let i = 0; i < 3; i++){
  const name = prompt("Enter a student's name")
  studentList.push(name);
}

for(let i = 0; i < studentList.length; i++){
  console.log(studentList[i]);
}