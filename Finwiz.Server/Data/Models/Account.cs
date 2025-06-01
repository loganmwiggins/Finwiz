namespace Finwiz.Server.Data.Models
{
    public class Account
    {
        public Guid Id { get; set; }

        public required string Name { get; set; }

        public required string Provider { get; set; }

        public required AccountType Type { get; set; }

        public double? CreditLimit { get; set; }

        public int? StatementDay { get; set; }

        public int? PaymentDay { get; set; }

        public int? DueDay { get; set; }

        public required bool IsAutopayOn { get; set; } = true;

        public double? AnnualFee { get; set; }

        public int? FeeMonth { get; set; }

        public int? FeeDay { get; set; }

        public string? ImagePath { get; set; }

        public string? Notes { get; set; }

        public double? APY { get; set; }

        public string? ColorHex { get; set; }

        // Navigation property
        public virtual ICollection<Statement> Statements { get; set; } = new List<Statement>();
    }


    public enum AccountType
    {
        Credit,
        Savings
    }
}