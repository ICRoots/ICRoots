import Principal "mo:base/Principal";
import Time      "mo:base/Time";
import Nat       "mo:base/Nat";

module {
  public type LoanStatus = { #Requested; #CollateralReady; #Funded; #Repaid; #Defaulted };

  public type Loan = {
    id           : Nat;
    borrower     : Principal;
    lender       : ?Principal;
    btcLocked    : Nat;          // satoshis
    amountUSDT   : Nat;          // cents
    interestBps  : Nat;          // 100 bps = 1 %
    requestedAt  : Time.Time;
    dueAt        : Time.Time;
    status       : LoanStatus;
  };
}
