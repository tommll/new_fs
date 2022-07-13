import * as faker from "faker";

export type Person = {
  id: string;
  fullName: string;
  email: string;
  security: string;
  performanceReport: string;
  timeOffApprover: string;
  team: string;
  active: boolean;
};
const PEOPLE_AMOUNT = 1000;
const createPeople = (): Person[] => {
  const people: Person[] = [];
  for (let i = 0; i < PEOPLE_AMOUNT; i++) {
    people.push({
      id: faker.datatype.uuid(),
      fullName: faker.name.findName(),
      email: faker.internet.email(),
      security: faker.random.word(),
      performanceReport: faker.internet.url(),
      timeOffApprover: faker.name.findName(),
      team: faker.company.companyName(),
      active: faker.datatype.boolean()
    });
  }
  return people;
};

export const peopleData = createPeople();
