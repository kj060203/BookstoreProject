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
        public IActionResult Get(int pageSize = 5, int pageNum = 1, bool isSorted = false, [FromQuery] List<string>? category = null)
        {
            var query = _context.Books.AsQueryable();

            // Apply sorting if isSorted is true
            if (isSorted)
            {
                query = query.OrderBy(b => b.Title); // Sorting by Title (or project name)
            }

            // Apply filtering by category if category is not null
            if (category != null && category.Any())
            {
                query = query.Where(b => category.Contains(b.Category));
            }

            var totalNumBooks = query.Count();

            var something = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return Ok(new { something, totalNumBooks });
        }
            [HttpGet("GetBookTypes")]

    public IActionResult GetBookTypes ()
    {
        var bookTypes = _context.Books
        .Select(b => b.Category)
        .Distinct()
        .ToList();
        
        return Ok(bookTypes);
    }
    }
}
