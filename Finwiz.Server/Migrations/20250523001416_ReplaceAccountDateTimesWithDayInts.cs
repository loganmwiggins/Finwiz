using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Finwiz.Server.Migrations
{
    /// <inheritdoc />
    public partial class ReplaceAccountDateTimesWithDayInts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DueDate",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "PaymentDate",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "StatementDate",
                table: "Accounts");

            migrationBuilder.AddColumn<int>(
                name: "DueDay",
                table: "Accounts",
                type: "int",
                nullable: true, defaultValue: null);

            migrationBuilder.AddColumn<int>(
                name: "PaymentDay",
                table: "Accounts",
                type: "int",
                nullable: true, defaultValue: null);

            migrationBuilder.AddColumn<int>(
                name: "StatementDay",
                table: "Accounts",
                type: "int",
                nullable: true, defaultValue: null);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DueDay",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "PaymentDay",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "StatementDay",
                table: "Accounts");

            migrationBuilder.AddColumn<DateTime>(
                name: "DueDate",
                table: "Accounts",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PaymentDate",
                table: "Accounts",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "StatementDate",
                table: "Accounts",
                type: "datetime2",
                nullable: true);
        }
    }
}
