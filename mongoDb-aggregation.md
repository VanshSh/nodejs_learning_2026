
# MongoDB Aggregation Practice Notes

Assume we have a `users` collection with fields like:

```
{
  name: "Vansh",
  age: 24,
  gender: "male",
  isActive: true,
  favoriteFruit: "banana",
  company: {
    location: {
      country: "India"
    }
  },
  eyeColor: "brown",
  tags: ["react", "mongodb", "frontend"]
}
````

---

# 1. How many users are active?

## Ans:

### Aggregation Pipeline

```js
db.users.aggregate([
  {
    $match: {
      isActive: true
    }
  },
  {
    $count: "activeUsers"
  }
])
```

### Explanation

* `$match` is used to filter only active users.
* `isActive: true` means only active users will pass to the next stage.
* `$count` counts the total documents after filtering.

### Use Case

Used when:

* Showing active user count on dashboard
* Analytics systems
* Monitoring platform engagement

---

# 2. What is the average age of all users?

## Ans:

### Aggregation Pipeline

```js
db.users.aggregate([
  {
    $group: {
      _id: null,
      averageAge: {
        $avg: "$age"
      }
    }
  }
])
```

### Explanation

* `$group` combines all documents into a single group.
* `_id: null` means all users belong to one group.
* `$avg` calculates average value of the `age` field.

### Use Case

Used when:

* Calculating audience demographics
* User analytics
* Product targeting

---

# 3. List the top 5 most common favorite fruits among users

## Ans:

### Aggregation Pipeline

```js
db.users.aggregate([
  {
    $group: {
      _id: "$favoriteFruit",
      count: {
        $sum: 1
      }
    }
  },
  {
    $sort: {
      count: -1
    }
  },
  {
    $limit: 5
  }
])
```

### Explanation

* `$group` groups users by `favoriteFruit`.
* `$sum: 1` counts how many users like each fruit.
* `$sort` sorts fruits in descending order.
* `$limit` returns only top 5 fruits.

### Use Case

Used when:

* Finding trends
* Recommendation systems
* User preference analytics

---

# 4. Find the total number of males and females

## Ans:

### Aggregation Pipeline

```js
db.users.aggregate([
  {
    $group: {
      _id: "$gender",
      count: {
        $sum: 1
      }
    }
  }
])
```

### Explanation

* `$group` groups users based on gender.
* `$sum: 1` counts total users in each gender category.

### Use Case

Used when:

* Demographic analysis
* Survey analytics
* Reporting systems

---

# 5. Which country has the highest number of registered users?

## Ans:

### Aggregation Pipeline

```js
db.users.aggregate([
  {
    $group: {
      _id: "$company.location.country",
      totalUsers: {
        $sum: 1
      }
    }
  },
  {
    $sort: {
      totalUsers: -1
    }
  },
  {
    $limit: 1
  }
])
```

### Explanation

* `$group` groups users by country.
* `$sum: 1` counts users in each country.
* `$sort` sorts countries by highest user count.
* `$limit: 1` returns only the top country.

### Use Case

Used when:

* Geo analytics
* Business expansion decisions
* Regional user analysis

---

# 6. List all unique eye colors present in the collection

## Ans:

### Aggregation Pipeline

```js
db.users.aggregate([
  {
    $group: {
      _id: "$eyeColor"
    }
  }
])
```

### Explanation

* `$group` creates unique groups based on `eyeColor`.
* Since no accumulator is used, only distinct values are returned.

### Use Case

Used when:

* Filter generation
* Dropdown options
* Data normalization checks

---

# 7. What is the average number of tags per user?

## Ans:

### Aggregation Pipeline

```js
db.users.aggregate([
  {
    $unwind: "$tags"
  },
  {
    $group: {
      _id: "$_id",
      numberOfTags: {
        $sum: 1
      }
    }
  },
  {
    $group: {
      _id: null,
      averageTagsPerUser: {
        $avg: "$numberOfTags"
      }
    }
  }
])
```

### Explanation

### Step 1 → `$unwind`

```js
{
  $unwind: "$tags"
}
```

* Converts each tag array element into separate documents.
* Example:

Before:

```js
{
  tags: ["react", "mongodb", "node"]
}
```

After unwind:

```js
{ tags: "react" }
{ tags: "mongodb" }
{ tags: "node" }
```

---

### Step 2 → Count tags per user

```js
{
  $group: {
    _id: "$_id",
    numberOfTags: {
      $sum: 1
    }
  }
}
```

* Groups documents back by user id.
* Counts total tags each user has.

---

### Step 3 → Calculate average

```js
{
  $group: {
    _id: null,
    averageTagsPerUser: {
      $avg: "$numberOfTags"
    }
  }
}
```

* Calculates average tag count across all users.

### Use Case

Used when:

* Measuring user engagement
* Interest/category analysis
* Recommendation systems
* Content personalization

---

```
```
````md
# 1. How many users have "enim" as one of their tags?

## Ans:

### Aggregation Pipeline

```js
db.users.aggregate([
  {
    $match: {
      tags: "enim"
    }
  },
  {
    $count: "usersWithEnimTag"
  }
])
````

### Explanation

* `tags` is an array field.
* MongoDB automatically checks whether `"enim"` exists inside the array.
* `$match` filters users containing `"enim"` in their tags array.
* `$count` gives total number of matching users.

### Use Case

Used when:

* Filtering users based on interests/tags
* Analytics on user preferences
* Recommendation systems

---

# 2. What are the name and age of users who are inactive and have "velit" as a tag?

## Ans:

### Aggregation Pipeline

```js
db.users.aggregate([
  {
    $match: {
      isActive: false,
      tags: "velit"
    }
  },
  {
    $project: {
      _id: 0,
      name: 1,
      age: 1
    }
  }
])
```

### Explanation

### Step 1 → `$match`

```js
{
  isActive: false,
  tags: "velit"
}
```

Filters users who:

* are inactive
* contain `"velit"` in their tags array

---

### Step 2 → `$project`

```js
{
  _id: 0,
  name: 1,
  age: 1
}
```

* Returns only required fields.
* Removes MongoDB default `_id`.

### Use Case

Used when:

* Generating filtered reports
* User segmentation
* Finding inactive users with specific interests

---

# 3. How many users have phone number starting with '+1 (940)'?

## Ans:

### Aggregation Pipeline

```js
db.users.aggregate([
  {
    $match: {
      phone: {
        $regex: /^\+1 \(940\)/
      }
    }
  },
  {
    $count: "usersWith940"
  }
])
```

### Explanation

### Regex Breakdown

```js
/^\+1 \(940\)/
```

* `^` → start of string
* `\+1` → matches `+1`
* `\(940\)` → matches `(940)`

This ensures the phone number starts with:

```txt
+1 (940)
```

---

### Aggregation Flow

* `$match` filters phone numbers matching the regex pattern.
* `$count` returns total matching users.

### Use Case

Used when:

* Filtering users by area code
* Regional analytics
* Telecom/customer segmentation

---


````md id="h3n7qk"
# 11. Who has registered most recently?

## Ans:

### Aggregation Pipeline

```js
db.users.aggregate([
  {
    $sort: {
      registered: -1
    }
  },
  {
    $limit: 1
  }
])
````

### Explanation

* `$sort` sorts users by `registered` date in descending order.
* `-1` means latest date first.
* `$limit: 1` returns only the most recently registered user.

### Use Case

Used when:

* Finding newest users
* Recent signup analytics
* Welcome/reward systems

---

# 12. Categorize users by their favourite fruit

## Ans:

### Aggregation Pipeline

```js id="8x1x3j"
db.users.aggregate([
  {
    $group: {
      _id: "$favoriteFruit",
      users: {
        $push: "$name"
      },
      totalUsers: {
        $sum: 1
      }
    }
  }
])
```

### Explanation

### `$group`

```js id="6qjxxo"
{
  _id: "$favoriteFruit"
}
```

Groups users based on favorite fruit.

---

### `$push`

```js id="w4y8ks"
users: {
  $push: "$name"
}
```

Collects all user names inside each fruit category.

---

### `$sum`

```js id="2avc0u"
totalUsers: {
  $sum: 1
}
```

Counts total users per fruit category.

### Example Output

```js id="5ldo0l"
{
  _id: "banana",
  users: ["Vansh", "Rahul"],
  totalUsers: 2
}
```

### Use Case

Used when:

* User segmentation
* Preference analysis
* Recommendation systems

---

# 13. How many users have 'ad' as their second tag in their list of tags?

## Ans:

### Aggregation Pipeline

```js id="ut7yij"
db.users.aggregate([
  {
    $match: {
      "tags.1": "ad"
    }
  },
  {
    $count: "usersWithSecondTagAd"
  }
])
```

### Explanation

### Array Index Access

```js id="t9gjrt"
"tags.1"
```

* MongoDB arrays are zero-indexed.
* `tags.1` means second element of array.

Example:

```js id="7v44p2"
["enim", "ad", "mongo"]
```

Here:

* `tags.0` → `"enim"`
* `tags.1` → `"ad"`

---

### Aggregation Flow

* `$match` filters users whose second tag is `"ad"`.
* `$count` returns total matching users.

### Use Case

Used when:

* Position-based array filtering
* Recommendation priority systems
* Ordered preference analysis

---

# 14. Find users who have both 'enim' and 'id' as their tags

## Ans:

### Aggregation Pipeline

```js id="zjv3d0"
db.users.aggregate([
  {
    $match: {
      tags: {
        $all: ["enim", "id"]
      }
    }
  }
])
```

### Explanation

### `$all`

```js id="pb9dth"
{
  $all: ["enim", "id"]
}
```

Ensures both values exist in the tags array.

Example valid array:

```js id="r0ysr2"
["react", "enim", "id"]
```

Example invalid array:

```js id="olam4f"
["enim"]
```

because `"id"` is missing.

### Use Case

Used when:

* Multi-interest filtering
* Advanced search systems
* Tag combination analytics

---

# 15. List all the companies located in the USA with their user count

## Ans:

### Aggregation Pipeline

```js id="h4m1l6"
db.users.aggregate([
  {
    $match: {
      "company.location.country": "USA"
    }
  },
  {
    $group: {
      _id: "$company.title",
      userCount: {
        $sum: 1
      }
    }
  },
  {
    $sort: {
      userCount: -1
    }
  }
])
```

### Explanation

### Step 1 → Filter USA companies

```js id="4vq2zw"
{
  "company.location.country": "USA"
}
```

Filters only companies located in USA.

---

### Step 2 → Group by company

```js id="2v89u2"
{
  _id: "$company.title"
}
```

Groups users based on company name.

---

### Step 3 → Count users

```js id="qg35tm"
userCount: {
  $sum: 1
}
```

Counts total users in each company.

### Use Case

Used when:

* Company-wise analytics
* Organization reporting
* Regional business analysis

---

# 16. Example of `$lookup`

## Ans:

Assume we have two collections:

### `users`

```js id="ngmxx3"
{
  _id: 1,
  name: "Vansh",
  companyId: 101
}
```

### `companies`

```js id="hajz8f"
{
  _id: 101,
  companyName: "Google"
}
```

---

## Aggregation Pipeline

```js id="azrth7"
db.users.aggregate([
  {
    $lookup: {
      from: "companies",
      localField: "companyId",
      foreignField: "_id",
      as: "companyDetails"
    }
  }
])
```

---

## Explanation

### `$lookup`

Used to perform JOIN operation between two collections.

---

### Fields Explanation

```js id="bbikb2"
{
  from: "companies"
}
```

* Target collection name.

---

```js id="24rwq9"
localField: "companyId"
```

* Field from current collection (`users`).

---

```js id="qclm55"
foreignField: "_id"
```

* Matching field from target collection (`companies`).

---

```js id="6tz6a8"
as: "companyDetails"
```

* Output array field containing matched data.

---

## Example Output

```js id="75v5ub"
{
  _id: 1,
  name: "Vansh",
  companyId: 101,
  companyDetails: [
    {
      _id: 101,
      companyName: "Google"
    }
  ]
}
```

---

## Use Case

Used when:

* Joining collections
* Relational-style queries in MongoDB
* Fetching related data
* Building dashboards/reports

---

```
```
