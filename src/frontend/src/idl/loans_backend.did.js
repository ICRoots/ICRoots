export const idlFactory = ({ IDL }) => {
  const InitArgs = IDL.Record({
    event_bus: IDL.Opt(IDL.Principal),
    repute: IDL.Opt(IDL.Principal),
    admin: IDL.Opt(IDL.Principal),
    collateral: IDL.Opt(IDL.Principal),
    trust_ai: IDL.Opt(IDL.Principal),
  });
  const LoanInfo = IDL.Record({
    id: IDL.Nat,
    status: IDL.Text,
    amount: IDL.Nat,
  });
  const Summary = IDL.Record({
    outstanding: IDL.Nat,
    collateral: IDL.Nat,
    level: IDL.Nat64,
    loans: IDL.Vec(LoanInfo),
    registered: IDL.Bool,
  });
  const RepayResult = IDL.Record({
    status: IDL.Text,
    repaid: IDL.Nat,
    remaining: IDL.Nat,
  });
  const LoanDecision = IDL.Record({
    reasons: IDL.Vec(IDL.Text),
    loan_id: IDL.Opt(IDL.Nat),
    decision: IDL.Text,
    score: IDL.Nat64,
  });
  return IDL.Service({
    get_summary: IDL.Func([IDL.Principal], [Summary], []),
    ping: IDL.Func([], [IDL.Text], ["query"]),
    register_user: IDL.Func([], [], []),
    repay: IDL.Func([IDL.Nat, IDL.Nat], [RepayResult], []),
    request_loan: IDL.Func([IDL.Nat], [LoanDecision], []),
  });
};
export const init = ({ IDL }) => {
  const InitArgs = IDL.Record({
    event_bus: IDL.Opt(IDL.Principal),
    repute: IDL.Opt(IDL.Principal),
    admin: IDL.Opt(IDL.Principal),
    collateral: IDL.Opt(IDL.Principal),
    trust_ai: IDL.Opt(IDL.Principal),
  });
  return [IDL.Opt(InitArgs)];
};
