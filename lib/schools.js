// Grading system definitions — easy to extend
export const GRADING_SYSTEMS = {
  'five_point': {
    label: '5.0 Scale',
    maxGPA: 5.0,
    grades: [
      { grade: 'A', points: 5.0, range: '70-100' },
      { grade: 'B', points: 4.0, range: '60-69' },
      { grade: 'C', points: 3.0, range: '50-59' },
      { grade: 'D', points: 2.0, range: '45-49' },
      { grade: 'E', points: 1.0, range: '40-44' },
      { grade: 'F', points: 0.0, range: '0-39' },
    ],
    classifications: [
      { label: 'First Class', min: 4.50, color: '#00d4aa' },
      { label: 'Second Class Upper', min: 3.50, color: '#0ea5e9' },
      { label: 'Second Class Lower', min: 2.40, color: '#f59e0b' },
      { label: 'Third Class', min: 1.50, color: '#f97316' },
      { label: 'Pass', min: 1.00, color: '#ef4444' },
      { label: 'Fail', min: 0.00, color: '#6b7280' },
    ],
  },
  'four_point': {
    label: '4.0 Scale',
    maxGPA: 4.0,
    grades: [
      { grade: 'A', points: 4.0, range: '70-100' },
      { grade: 'B', points: 3.0, range: '60-69' },
      { grade: 'C', points: 2.0, range: '50-59' },
      { grade: 'D', points: 1.0, range: '40-49' },
      { grade: 'F', points: 0.0, range: '0-39' },
    ],
    classifications: [
      { label: 'First Class', min: 3.60, color: '#00d4aa' },
      { label: 'Second Class Upper', min: 3.00, color: '#0ea5e9' },
      { label: 'Second Class Lower', min: 2.00, color: '#f59e0b' },
      { label: 'Third Class', min: 1.50, color: '#f97316' },
      { label: 'Pass', min: 1.00, color: '#ef4444' },
      { label: 'Fail', min: 0.00, color: '#6b7280' },
    ],
  },
  'seven_point': {
    label: '7.0 Scale',
    maxGPA: 7.0,
    grades: [
      { grade: 'A', points: 7.0, range: '70-100' },
      { grade: 'B', points: 6.0, range: '60-69' },
      { grade: 'C', points: 5.0, range: '50-59' },
      { grade: 'D', points: 4.0, range: '45-49' },
      { grade: 'E', points: 3.0, range: '40-44' },
      { grade: 'F', points: 0.0, range: '0-39' },
    ],
    classifications: [
      { label: 'First Class', min: 6.00, color: '#00d4aa' },
      { label: 'Second Class Upper', min: 5.00, color: '#0ea5e9' },
      { label: 'Second Class Lower', min: 4.00, color: '#f59e0b' },
      { label: 'Third Class', min: 3.00, color: '#f97316' },
      { label: 'Pass', min: 2.00, color: '#ef4444' },
      { label: 'Fail', min: 0.00, color: '#6b7280' },
    ],
  },
}

export const SCHOOLS = [
  // Federal Universities
  { name: 'University of Lagos (UNILAG)', abbr: 'UNILAG', system: 'five_point', state: 'Lagos' },
  { name: 'University of Nigeria, Nsukka (UNN)', abbr: 'UNN', system: 'five_point', state: 'Enugu' },
  { name: 'University of Ibadan (UI)', abbr: 'UI', system: 'five_point', state: 'Oyo' },
  { name: 'Obafemi Awolowo University (OAU)', abbr: 'OAU', system: 'five_point', state: 'Osun' },
  { name: 'Ahmadu Bello University (ABU)', abbr: 'ABU', system: 'five_point', state: 'Kaduna' },
  { name: 'Federal University of Technology, Akure (FUTA)', abbr: 'FUTA', system: 'five_point', state: 'Ondo' },
  { name: 'University of Benin (UNIBEN)', abbr: 'UNIBEN', system: 'five_point', state: 'Edo' },
  { name: 'University of Ilorin (UNILORIN)', abbr: 'UNILORIN', system: 'five_point', state: 'Kwara' },
  { name: 'University of Port Harcourt (UNIPORT)', abbr: 'UNIPORT', system: 'five_point', state: 'Rivers' },
  { name: 'Nnamdi Azikiwe University (UNIZIK)', abbr: 'UNIZIK', system: 'five_point', state: 'Anambra' },
  { name: 'Enugu State University (ESUT)', abbr: 'ESUT', system: 'five_point', state: 'Enugu' },

  // State Universities
  { name: 'Lagos State University (LASU)', abbr: 'LASU', system: 'five_point', state: 'Lagos' },
  { name: 'Lagos State University of Science & Tech (LASUSTECH)', abbr: 'LASUSTECH', system: 'five_point', state: 'Lagos' },

  // Polytechnics and Colleges
  { name: 'Yaba College of Technology (YABATECH)', abbr: 'YABATECH', system: 'five_point', state: 'Lagos' },
  { name: 'Federal Polytechnic', abbr: 'FEDPOLY', system: 'five_point', state: '' },
  { name: 'State Polytechnic', abbr: 'STATEPOLY', system: 'five_point', state: '' },
  { name: 'College of Education (COE)', abbr: 'COE', system: 'five_point', state: '' },
  { name: 'Federal College of Education (FCE)', abbr: 'FCE', system: 'five_point', state: '' },

  // Private Universities
  { name: 'Covenant University', abbr: 'Covenant', system: 'four_point', state: 'Ogun' },
  { name: 'Babcock University', abbr: 'Babcock', system: 'four_point', state: 'Ogun' },
  { name: 'American University of Nigeria (AUN)', abbr: 'AUN', system: 'four_point', state: 'Adamawa' },
  { name: 'Pan-Atlantic University (PAU)', abbr: 'PAU', system: 'four_point', state: 'Lagos' },

  // Custom
  { name: 'Other School (5.0 Scale)', abbr: 'OTHER_5', system: 'five_point', state: '' },
  { name: 'Other School (4.0 Scale)', abbr: 'OTHER_4', system: 'four_point', state: '' },
  { name: 'Other School (7.0 Scale)', abbr: 'OTHER_7', system: 'seven_point', state: '' },
  { name: 'Other University', abbr: 'OTHER_UNI', system: 'five_point', state: '' },
  { name: 'Other Polytechnic', abbr: 'OTHER_POLY', system: 'five_point', state: '' },
  { name: 'Other College of Education', abbr: 'OTHER_COE', system: 'five_point', state: '' },
]

export function getClassification(gpa, system) {
  const gradingSystem = GRADING_SYSTEMS[system]
  for (const cls of gradingSystem.classifications) {
    if (gpa >= cls.min) return cls
  }
  return gradingSystem.classifications[gradingSystem.classifications.length - 1]
}

export function calculateGPA(courses, system) {
  const gradingSystem = GRADING_SYSTEMS[system]
  let totalPoints = 0
  let totalUnits = 0

  for (const course of courses) {
    const units = parseFloat(course.units)
    if (!units || units <= 0) continue
    const gradeObj = gradingSystem.grades.find(g => g.grade === course.grade)
    if (!gradeObj) continue
    totalPoints += units * gradeObj.points
    totalUnits += units
  }

  if (totalUnits === 0) return { gpa: 0, totalUnits: 0, totalPoints: 0 }
  return {
    gpa: totalPoints / totalUnits,
    totalUnits,
    totalPoints,
  }
}

export function calculateCGPA(semesters, system) {
  let totalPoints = 0
  let totalUnits = 0

  for (const semester of semesters) {
    const result = calculateGPA(semester.courses, system)
    totalPoints += result.totalPoints
    totalUnits += result.totalUnits
  }

  if (totalUnits === 0) return 0
  return totalPoints / totalUnits
}

export function predictTargetGPA(currentCGPA, currentUnits, targetCGPA, remainingUnits, system) {
  const maxGPA = GRADING_SYSTEMS[system].maxGPA
  if (remainingUnits <= 0) return null

  const currentTotalPoints = currentCGPA * currentUnits
  const requiredTotalPoints = targetCGPA * (currentUnits + remainingUnits)
  const requiredPoints = requiredTotalPoints - currentTotalPoints
  const requiredGPA = requiredPoints / remainingUnits

  return {
    requiredGPA: Math.max(0, requiredGPA),
    isAchievable: requiredGPA <= maxGPA,
    isAlreadyAchieved: currentCGPA >= targetCGPA,
  }
}
