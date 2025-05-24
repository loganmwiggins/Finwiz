using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Finwiz.Server.Migrations
{
    /// <inheritdoc />
    public partial class FeeMonthAndFeeDayProps : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FeeDate",
                table: "Accounts");

            migrationBuilder.AddColumn<int>(
                name: "FeeDay",
                table: "Accounts",
                type: "int",
                nullable: true, defaultValue: null);

            migrationBuilder.AddColumn<int>(
                name: "FeeMonth",
                table: "Accounts",
                type: "int",
                nullable: true, defaultValue: null);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FeeDay",
                table: "Accounts");

            migrationBuilder.DropColumn(
                name: "FeeMonth",
                table: "Accounts");

            migrationBuilder.AddColumn<DateTime>(
                name: "FeeDate",
                table: "Accounts",
                type: "datetime2",
                nullable: true);
        }
    }
}
