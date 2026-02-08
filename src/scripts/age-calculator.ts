const BIRTH_YEAR = 2004;
const BIRTH_MONTH = 12;
const BIRTH_DAY = 9;

export const calculateAge = (): number => {
    const now = new Date();
    let age = now.getFullYear() - BIRTH_YEAR;

    const monthDiff = now.getMonth() + 1 - BIRTH_MONTH;
    const dayDiff = now.getDate() - BIRTH_DAY;

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
};

export const AGE = calculateAge();
