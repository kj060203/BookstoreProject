using BookstoreProject.API.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace BookstoreProject.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookstoreController : ControllerBase
    {
        private readonly BookstoreDbContext _context;

        public BookstoreController(BookstoreDbContext temp)
        {
            _context = temp;
        }

        [HttpGet]
        public IActionResult Get(int pageSize = 5, int pageNum = 1, bool isSorted = false)
        {
            var query = _context.Books.AsQueryable();

            // Apply sorting if isSorted is true
            if (isSorted)
            {
                query = query.OrderBy(b => b.Title); // Sorting by Title (or project name)
            }

            var something = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var totalNumBooks = _context.Books.Count();

            return Ok(new { something, totalNumBooks });
        }
    }
}
