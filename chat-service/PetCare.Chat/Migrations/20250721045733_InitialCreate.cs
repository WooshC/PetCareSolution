using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PetCare.Chat.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ChatMessages",
                columns: table => new
                {
                    MessageID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SenderID = table.Column<int>(type: "int", nullable: false),
                    ReceiverID = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    MessageType = table.Column<string>(type: "nvarchar(max)", nullable: false, defaultValue: "Text"),
                    IsRead = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    AttachmentUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AttachmentName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IdChat = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    SenderName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReceiverName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SolicitudID = table.Column<int>(type: "int", nullable: true),
                    SolicitudEstado = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatMessages", x => x.MessageID);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_IdChat",
                table: "ChatMessages",
                column: "IdChat");

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_ReceiverID_IsRead",
                table: "ChatMessages",
                columns: new[] { "ReceiverID", "IsRead" });

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_SenderID_ReceiverID",
                table: "ChatMessages",
                columns: new[] { "SenderID", "ReceiverID" });

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_Timestamp",
                table: "ChatMessages",
                column: "Timestamp");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChatMessages");
        }
    }
}
