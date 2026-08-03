export type ValueCard = {
  title: string;
  text: string;
};

export type ValuesContent = {
  label: string;
  title: string;
  cards: ValueCard[];
};

export const valuesContent: ValuesContent = {
  label: "Core Values",
  title: "What shapes how we live and lead",
  cards: [
    {
      title: "Relationships & Accountability",
      text: "True kingdom relationships. Accountability, covering, oversight, fatherhood and sonship mentoring — maximizing potential all round.",
    },
    {
      title: "Servant-Leadership & Integrity",
      text: "Integrity never sacrificed on altars of fame, funds, fear or favour. Leadership rooted in humility and godly character.",
    },
    {
      title: "A Culture of Excellence",
      text: "Diligence, Honour, Service, Humility, Passion, Joy. Kingdom-minded. Strong in the Word. Functioning at full potential.",
    },
  ],
};
