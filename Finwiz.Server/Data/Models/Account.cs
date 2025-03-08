namespace Finwiz.Server.Data.Models
{
    public class Account
    {
        public Guid Id { get; set; }

        public required string Name { get; set; }

        public required string Provider { get; set; }

        public required AccountType Type { get; set; }

        public double? CreditLimit { get; set; }

        public DateTime? StatementDate { get; set; }

        public DateTime? PaymentDate { get; set; }

        public DateTime? DueDate { get; set; }

        public required bool IsAutopayOn { get; set; } = true;

        public double? AnnualFee { get; set; }

        public DateTime? FeeDate { get; set; }

        public string? ImagePath { get; set; }

        public string? Notes { get; set; }

        public double? APY {  get; set; }

        // Navigation property
        public virtual ICollection<Statement> Statements { get; set; } = new List<Statement>();
    }


    public enum AccountType
    {
        Credit,
        Savings
    }
}