
https://chatgpt.com/share/6a04bc2f-b21c-8320-b8e9-2f7d47f62a65
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
