using Microsoft.AspNetCore.Http;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace PetCare.Shared
{
    public class AuditMiddleware
    {
        private readonly RequestDelegate _next;


        public AuditMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IAuditService auditService)
        {
            // Capture request details before
            var request = context.Request;
            var userId = context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            
            // Proceed
            await _next(context);

            // Audit after (or before if we want to log attempts)
            // Log only modifying methods?
            if (request.Method != "GET" && request.Method != "OPTIONS")
            {
                var audit = new AuditLog
                {
                    UserId = userId,
                    Action = request.Method,
                    EntityName = request.Path,
                    IpAddress = context.Connection.RemoteIpAddress?.ToString(),
                    UserAgent = request.Headers["User-Agent"].ToString(),
                    NewValues = $"Status: {context.Response.StatusCode}"
                };

                await auditService.LogAsync(audit);
            }
        }
    }
}
