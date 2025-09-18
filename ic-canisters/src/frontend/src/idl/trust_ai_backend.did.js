export const idlFactory = ({ IDL }) => {
  const InitArgs = IDL.Record({
    trust_cap: IDL.Opt(IDL.Nat64),
    min_trust: IDL.Opt(IDL.Nat64),
    min_collateral: IDL.Opt(IDL.Nat),
  });
  const Recommendation = IDL.Record({
    reasons: IDL.Vec(IDL.Text),
    decision: IDL.Text,
    score: IDL.Nat64,
  });
  return IDL.Service({
    recommend: IDL.Func(
      [IDL.Principal, IDL.Nat, IDL.Nat64],
      [Recommendation],
      ["query"],
    ),
  });
};
export const init = ({ IDL }) => {
  const InitArgs = IDL.Record({
    trust_cap: IDL.Opt(IDL.Nat64),
    min_trust: IDL.Opt(IDL.Nat64),
    min_collateral: IDL.Opt(IDL.Nat),
  });
  return [IDL.Opt(InitArgs)];
};
