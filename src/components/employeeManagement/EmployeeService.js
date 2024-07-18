const generateRandomString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
};

const generateUUIDv4 = () => {
    const hexDigits = '0123456789abcdef';
    let uuid = '';

    for (let i = 0; i < 32; i++) {
        if (i === 8 || i === 12 || i === 16 || i === 20) {
            uuid += '-';
            // eslint-disable-next-line no-dupe-else-if
        } else if (i === 16) {
            uuid += hexDigits[(Math.random() * 4) | 8];
        } else {
            uuid += hexDigits[Math.floor(Math.random() * 16)];
        }
    }

    return uuid;
};

// Example usage
const uuid = generateUUIDv4();

const generateDummyData = () => {
    const dummyData = [];
    const genders = ['MALE', 'FEMALE'];
    const maritalStatuses = ['SINGLE', 'MARRIED', 'DIVORCED'];
    const idTypes = ['NATIONAL_ID', 'PASSPORT', 'DRIVER_LICENSE'];
    const paymentFrequencies = ['MONTHLY', 'BIWEEKLY', 'WEEKLY'];

    for (let i = 0; i < 80; i++) {
        const firstName = `First${generateRandomString(5)}`;
        const lastName = `Last${generateRandomString(5)}`;
        const fullName = `${firstName} ${lastName}`;
        const data = {
            firstName: fullName,
            otherNames: `Other${generateRandomString(5)}`, // Generates a 5-character random string
            phoneNumber: `+794 859 595 474`,
            gender: genders[Math.floor(Math.random() * genders.length)],
            emailAddress: `email${i + 1}@example.com`,
            physicalAddress: `Address ${i + 1}`,
            dateOfBirth: '2024-04-23',
            dateOfJoining: '2024-04-23',
            maritalStatus: maritalStatuses[Math.floor(Math.random() * maritalStatuses.length)],
            idType: idTypes[Math.floor(Math.random() * idTypes.length)],
            idNumber: `ID${i + 1}`,
            designationId: uuid, // Random UUID
            nationalityId: uuid, // Random UUID
            departmentId: uuid, // Random UUID
            educationQualification: [
                {
                    name: `Qualification ${i + 1}`,
                    yearOfAward: '2024-04-23'
                }
            ],
            salaryRequest: {
                basicSalary: Math.floor(Math.random() * 50000) + 50000,
                paymentFrequency: paymentFrequencies[Math.floor(Math.random() * paymentFrequencies.length)],
                employeeId: uuid // Random UUID
            }
        };
        dummyData.push(data);
    }

    return dummyData;
};

// Generate 10 dummy data entries
const productList = generateDummyData();

// Simulated asynchronous API call to fetch Employees data
const getEmployeesMedium = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(productList);
        }, 1000); // Simulate a delay of 1 second (1000ms) to mimic an API call
    });
};

// Exporting the EmployeeService module
export const EmployeeService = {
    getEmployeesMedium
};
