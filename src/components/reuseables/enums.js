const genderOptionsEnum = [
    { name: 'MALE', code: 'MALE' },
    { name: 'FEMALE', code: 'FEMALE' }
];
const maritalStatusOptionsEnum = [
    { name: 'SINGLE', code: 'SINGLE' },
    { name: 'MARRIED', code: 'MARRIED' },
    { name: 'WIDOWED', code: 'WIDOWED' },
    { name: 'DIVORCED', code: 'DIVORCED' }
];
const idTypeOptionsEnum = [
    { name: 'NATIONAL_ID', code: 'NATIONAL_ID' },
    { name: 'PASSPORT', code: 'PASSPORT' },
    { name: 'DRIVING_PERMIT', code: 'DRIVING_PERMIT' },
    { name: 'OTHERS', code: 'OTHERS' }
];

const employeeLevelsEnum = [
    { name: 'LEVEL_1', code: 'LEVEL_1' },
    { name: 'LEVEL_2', code: 'LEVEL_2' },
    { name: 'LEVEL_3', code: 'LEVEL_3' },
    { name: 'LEVEL_4', code: 'LEVEL_4' },
    { name: 'LEVEL_5', code: 'LEVEL_5' },
    { name: 'LEVEL_6', code: 'LEVEL_6' },
    { name: 'LEVEL_7', code: 'LEVEL_7' }
];


const PaymentFrequencyType = [
    { name: 'MONTHLY', code: 'MONTHLY' },
    { name: 'BI_WEEKLY', code: 'BI_WEEKLY' },
    { name: 'WEEKLY', code: 'WEEKLY' }
];
const DeductionType = [
    { name: 'PAYE', code: 'PAYE' },
    { name: 'NSSF', code: 'NSSF' },
    { name: 'LST', code: 'LST' },
    { name: 'OTHER', code: 'OTHER' }
];
const PaymentMethod = [
    { name: 'CASH', code: 'CASH' },
    { name: 'BANK_TRANSFER', code: 'BANK_TRANSFER' },
    { name: 'CHEQUE', code: 'CHEQUE' }
];
const TransferType = [
    { name: 'TEMPORARY', code: 'TEMPORARY' },
    { name: 'PERMANENT', code: 'PERMANENT' }
];
const TravelOutsideAllowanceSubType = [
    { name: 'SUBSISTENCE', code: 'SUBSISTENCE' },
    { name: 'POCKET', code: 'POCKET' },
    { name: 'TRANSPORT', code: 'TRANSPORT' },
    { name: 'TRANSIT', code: 'TRANSIT' },
    { name: 'WARM_CLOTHING', code: 'WARM_CLOTHING' },
    { name: 'BAGGAGE', code: 'BAGGAGE' }
];
const AllowanceType = [
    { name: 'ACTING', code: 'ACTING' },
    { name: 'RESPONSIBILITY', code: 'RESPONSIBILITY' },
    { name: 'OVERTIME', code: 'OVERTIME' },
    { name: 'HARDSHIP', code: 'HARDSHIP' },
    { name: 'VEHICLE_FUEL', code: 'VEHICLE_FUEL' },
    { name: 'MILEAGE', code: 'MILEAGE' },
    { name: 'TRANSFER', code: 'TRANSFER' },
    { name: 'TRAVEL_WITHIN', code: 'TRAVEL_WITHIN' },
    { name: 'TRAVEL_OUTSIDE', code: 'TRAVEL_OUTSIDE' },
    { name: 'SPECIAL_DUTY', code: 'SPECIAL_DUTY' }
];
const AppraisalPhase = [
    { name: 'CONTINUOUS_MONITORING', code: 'CONTINUOUS_MONITORING' },
    { name: 'INTERIM_REVIEW', code: 'INTERIM_REVIEW' },
    { name: 'END_OF_YEAR_APPRAISAL', code: 'END_OF_YEAR_APPRAISAL' }
];
const AppealStatus = [
    { name: 'SUBMITTED', code: 'SUBMITTED' },
    { name: 'UNDER_REVIEW', code: 'UNDER_REVIEW' },
    { name: 'RESOLVED', code: 'RESOLVED' },
    { name: 'REJECTED', code: 'REJECTED' },
    { name: 'ESCALATED', code: 'ESCALATED' }
];
const MetricCategory = [
    { name: 'FINANCIAL', code: 'FINANCIAL' },
    { name: 'CUSTOMER', code: 'CUSTOMER' },
    { name: 'INTERNAL_PROCESSES', code: 'INTERNAL_PROCESSES' },
    { name: 'LEARNING_GROWTH', code: 'LEARNING_GROWTH' },
    { name: 'BEHAVIORAL', code: 'BEHAVIORAL' }
];
const RecognitionCriteria = [
    { name: 'EXEMPLARY_LEADERSHIP', code: 'EXEMPLARY_LEADERSHIP' },
    { name: 'COMPLEX_INITIATIVES', code: 'COMPLEX_INITIATIVES' },
    { name: 'EXCEPTIONAL_PERFORMANCE', code: 'EXCEPTIONAL_PERFORMANCE' },
    { name: 'EXEMPLARY_SERVICE', code: 'EXEMPLARY_SERVICE' },
    { name: 'CONSISTENT_EXCELLENCE', code: 'CONSISTENT_EXCELLENCE' },
    { name: 'REVENUE_TARGETS', code: 'REVENUE_TARGETS' }
];
const RewardType = [
    { name: 'INFORMAL', code: 'INFORMAL' },
    { name: 'FORMAL', code: 'FORMAL' },
    { name: 'EXTRAORDINARY', code: 'EXTRAORDINARY' }
];
const DifficultyLevel = [
    { name: 'BEGINNER', code: 'BEGINNER' },
    { name: 'INTERMEDIATE', code: 'INTERMEDIATE' },
    { name: 'ADVANCED', code: 'ADVANCED' }
];
const TrainingStatus = [
    { name: 'DRAFT', code: 'DRAFT' },
    { name: 'ACTIVE', code: 'ACTIVE' },
    { name: 'ARCHIVED', code: 'ARCHIVED' }
];
const QuestionType = [
    { name: 'MULTIPLE_CHOICE', code: 'MULTIPLE_CHOICE' },
    { name: 'TEXT', code: 'TEXT' },
    { name: 'TRUE_FALSE', code: 'TRUE_FALSE' },
    { name: 'ESSAY', code: 'ESSAY' }
];
const leaveTypes = [
    { name: 'ANNUAL_LEAVE', code: 'ANNUAL_LEAVE' },
    { name: 'MATERNITY_LEAVE', code: 'MATERNITY_LEAVE' },
    { name: 'PATERNITY_LEAVE', code: 'PATERNITY_LEAVE' },
    { name: 'SICK_LEAVE', code: 'SICK_LEAVE' },
    { name: 'COMPASSIONATE_LEAVE', code: 'COMPASSIONATE_LEAVE' },
    { name: 'STUDY_LEAVE', code: 'STUDY_LEAVE' },
    { name: 'SPECIAL_LEAVE', code: 'SPECIAL_LEAVE' },
    { name: 'LEAVE_WITHOUT_PAY', code: 'LEAVE_WITHOUT_PAY' }
];
const ProgressStatus = [

    {name:"NOT_STARTED",code:"NOT_STARTED"},
    {name:"IN_PROGRESS",code:"IN_PROGRESS"},
    {name:"COMPLETED",code:"COMPLETED"},
    {name:"ON_HOLD",code:"ON_HOLD"},
    {name:"CANCELLED",code:"CANCELLED"}

]

const QuestionDifficulty = [

    {name:"EASY",code:"EASY"},
    {name:"MEDIUM", code:"MEDIUM"},
    {name:"HARD", code:"HARD"}
]
export {
    genderOptionsEnum,
    maritalStatusOptionsEnum,
    idTypeOptionsEnum,
    employeeLevelsEnum,
    leaveTypes,
    TransferType,
    PaymentFrequencyType,
    DeductionType,
    PaymentMethod,
    TravelOutsideAllowanceSubType,
    AllowanceType,
    AppraisalPhase,
    AppealStatus,
    MetricCategory,
    RecognitionCriteria,
    RewardType,
    DifficultyLevel,
    TrainingStatus,
    QuestionType,
    ProgressStatus,
    QuestionDifficulty
};
