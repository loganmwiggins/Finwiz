namespace Finwiz.Server.Data.Models
{
    public class Account
    {
        public Guid Id { get; set; }

        public required string Name { get; set; }

        public required string Provider { get; set; }

        public required string Type { get; set; }   // Consider converting to an enum: Credit, Savings

        public double? CreditLimit { get; set; }

        public DateOnly? StatementDate { get; set; }

        public DateOnly? PaymentDate { get; set; }

        public DateOnly? DueDate { get; set; }

        public required bool IsAutopayOn { get; set; } = true;

        public double? AnnualFee { get; set; }

        public DateOnly? FeeDate { get; set; }

        public string? ImagePath { get; set; }

        public string? Notes { get; set; }

        public double? APY {  get; set; }

        // Navigation property
        public virtual ICollection<AccountPayment> Payments { get; set; } = new List<AccountPayment>();
    }
}