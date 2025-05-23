using Finwiz.Server.Data.Models;

namespace Finwiz.Server.Data.DTOs
{
    public class AccountDTOs
    {
        public class CreateAccountDTO
        {
            public required string Name { get; set; }

            public required string Provider { get; set; }

            public required AccountType Type { get; set; }

            public double? CreditLimit { get; set; }

            //public DateTime? StatementDate { get; set; }

            //public DateTime? PaymentDate { get; set; }

            //public DateTime? DueDate { get; set; }

            public int? StatementDay { get; set; }

            public int? PaymentDay { get; set; }

            public int? DueDay { get; set; }

            public required bool IsAutopayOn { get; set; }

            public double? AnnualFee { get; set; }

            public DateTime? FeeDate { get; set; }

            public string? ImagePath { get; set; }

            public string? Notes { get; set; }

            public double? APY { get; set; }
        }
    }
}