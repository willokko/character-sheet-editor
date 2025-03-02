export const rollDice = (diceCount, diceSides, modifier = 0) => {
  let total = 0;
  const rolls = [];

  for (let i = 0; i < diceCount; i++) {
    const roll = Math.floor(Math.random() * diceSides) + 1;
    rolls.push(roll);
    total += roll;
  }

  return {
    total: total + modifier,
    rolls,
    modifier
  };
};

export const formatRoll = (rollResult) => {
  const { total, rolls, modifier } = rollResult;
  const rollsStr = rolls.join(' + ');
  const modifierStr = modifier > 0 ? ` + ${modifier}` : modifier < 0 ? ` - ${Math.abs(modifier)}` : '';
  
  return `${rollsStr}${modifierStr} = ${total}`;
};
