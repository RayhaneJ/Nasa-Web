using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using Nasa_API.Helpers;
using Nasa_API.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Nasa_API.Pages
{
    public class AsteroidsModel : PageModel
    {
        private readonly IConfiguration _configuration;
        public AsteroidsModel(IHttpClientFactory clientFactory, IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void OnGet()
        {
         
        }

        private static IEnumerable<JToken> AllChildren(JToken json)
        {
            foreach (var c in json.Children())
            {
                yield return c;
                foreach (var cc in AllChildren(c))
                {
                    yield return cc;
                }
            }
        }


    }
}