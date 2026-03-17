function includesAny(text, keywords) {
  return keywords.some((keyword) => text.includes(keyword));
}

export function getAiServiceSuggestion(input) {
  const text = input.trim().toLowerCase();

  if (!text) {
    return {
      possibleIssue: "Няма въведено описание",
      recommendedService: "Обща диагностика",
      urgency: "Ниска",
      advice: "Опиши проблема по-подробно, за да получиш по-точна препоръка.",
    };
  }

  if (
    includesAny(text, [
      "тресе",
      "тресене",
      "прекъсва",
      "прекъсване",
      "misfire",
      "rough idle",
      "check engine",
      "engine light",
      "неравномерно",
      "вибрация",
      "вибрира",
    ])
  ) {
    return {
      possibleIssue: "Възможен проблем в запалителната, горивната или всмукателната система",
      recommendedService: "Диагностика на двигател",
      urgency: "Висока",
      advice: "Избягвай натоварено каране, докато автомобилът не бъде прегледан.",
    };
  }

  if (
    includesAny(text, [
      "спирач",
      "спиране",
      "педал",
      "скърца",
      "свирене",
      "grinding",
      "squeaking",
      "мек педал",
    ])
  ) {
    return {
      possibleIssue: "Възможно износване на накладки, дискове или проблем със спирачната течност",
      recommendedService: "Преглед на спирачна система",
      urgency: "Висока",
      advice: "Проблемите със спирачките трябва да се проверят възможно най-скоро.",
    };
  }

  if (
    includesAny(text, [
      "не пали",
      "пали трудно",
      "стартер",
      "акумулатор",
      "battery",
      "clicking",
      "weak battery",
    ])
  ) {
    return {
      possibleIssue: "Възможен проблем с акумулатора, стартера или зарядната система",
      recommendedService: "Проверка на акумулатор и ел. система",
      urgency: "Средна",
      advice: "Добре е да се измерят акумулаторът и алтернаторът преди смяна на части.",
    };
  }

  if (
    includesAny(text, [
      "загрява",
      "прегрява",
      "temperature",
      "coolant",
      "антифриз",
      "radiator",
      "перка",
      "вентилатор",
    ])
  ) {
    return {
      possibleIssue: "Възможен проблем в охладителната система",
      recommendedService: "Диагностика на охладителна система",
      urgency: "Висока",
      advice: "Не карай продължително, ако температурата се повишава необичайно.",
    };
  }

  if (
    includesAny(text, [
      "скорости",
      "съединител",
      "clutch",
      "gear",
      "transmission",
      "трудно влиза",
      "не включва",
    ])
  ) {
    return {
      possibleIssue: "Възможен проблем със съединителя, скоростната кутия или трансмисията",
      recommendedService: "Преглед на съединител и трансмисия",
      urgency: "Средна",
      advice: "Обърни внимание дали проблемът се проявява на студено, топло или под товар.",
    };
  }

  if (
    includesAny(text, [
      "шум",
      "тропа",
      "чукане",
      "rattle",
      "knocking",
      "окачване",
      "suspension",
      "предница",
      "задница",
    ])
  ) {
    return {
      possibleIssue: "Възможен проблем в окачването, тампони или разхлабен компонент",
      recommendedService: "Преглед на окачване и ходова част",
      urgency: "Средна",
      advice: "Отбележи дали шумът се появява при неравности, завиване, спиране или ускорение.",
    };
  }

  if (
    includesAny(text, [
      "климатик",
      "ac",
      "air conditioner",
      "не охлажда",
      "blower",
      "парно",
      "вентилация",
    ])
  ) {
    return {
      possibleIssue: "Възможен проблем с климатика, компресора или вентилационната система",
      recommendedService: "Преглед на климатична система",
      urgency: "Ниска",
      advice: "Не е критично за безопасността, но е добре да се провери навреме.",
    };
  }

  return {
    possibleIssue: "Общ механичен или електрически проблем",
    recommendedService: "Пълна диагностика",
    urgency: "Средна",
    advice: "Добави повече симптоми като шумове, лампи по таблото, миризми или кога се появява проблемът.",
  };
}